package com.giuakyqldupm.SalesManagement.service;

import com.giuakyqldupm.SalesManagement.dto.request.CartItemRequest;
import com.giuakyqldupm.SalesManagement.dto.request.GuestOrderRequest;
import com.giuakyqldupm.SalesManagement.dto.request.OrderRequest;
import com.giuakyqldupm.SalesManagement.dto.response.OrderItemResponse;
import com.giuakyqldupm.SalesManagement.dto.response.OrderResponse;
import com.giuakyqldupm.SalesManagement.dto.response.PageResponse;
import com.giuakyqldupm.SalesManagement.entity.*;
import com.giuakyqldupm.SalesManagement.exception.BadRequestException;
import com.giuakyqldupm.SalesManagement.exception.ResourceNotFoundException;
import com.giuakyqldupm.SalesManagement.repository.OrderRepository;
import com.giuakyqldupm.SalesManagement.repository.ProductRepository;
import com.giuakyqldupm.SalesManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final EmailService emailService;

    @Transactional
    public OrderResponse createOrder(String username, OrderRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setRecipientName(request.getRecipientName());
        order.setRecipientPhone(request.getRecipientPhone());
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.COMPLETED);

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(subtotal);

            order.addOrderItem(orderItem);
            orderItems.add(orderItem);

            totalPrice = totalPrice.add(subtotal);

            productService.updateStock(product.getId(), item.getQuantity());
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        try {
            emailService.sendOrderConfirmationEmail(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return mapToResponse(savedOrder);
    }

    public PageResponse<OrderResponse> getOrdersByUser(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByUserId(user.getId(), pageable);

        return mapToPageResponse(orderPage);
    }

    public PageResponse<OrderResponse> getAllOrders(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Order> orderPage = orderRepository.findAll(pageable);

        return mapToPageResponse(orderPage);
    }

    public PageResponse<OrderResponse> getOrdersByStatus(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.findByStatus(Order.OrderStatus.valueOf(status), pageable);

        return mapToPageResponse(orderPage);
    }

    public PageResponse<OrderResponse> searchOrders(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Order> orderPage = orderRepository.searchOrders(keyword, pageable);

        return mapToPageResponse(orderPage);
    }

    public OrderResponse getOrderById(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.UserRole.ADMIN)) {
            throw new BadRequestException("You don't have permission to view this order");
        }

        return mapToResponse(order);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        order.setStatus(Order.OrderStatus.valueOf(status));
        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }

    @Transactional
    public void cancelOrder(Long id, String username) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!order.getUser().getId().equals(user.getId()) && !user.getRole().equals(User.UserRole.ADMIN)) {
            throw new BadRequestException("You don't have permission to cancel this order");
        }

        if (!order.getStatus().equals(Order.OrderStatus.PENDING)) {
            throw new BadRequestException("Only pending orders can be cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            if (product.getStatus().equals(Product.ProductStatus.OUT_OF_STOCK)) {
                product.setStatus(Product.ProductStatus.ACTIVE);
            }
            productRepository.save(product);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser() != null ? order.getUser().getId() : null)
                .username(order.getUser() != null ? order.getUser().getUsername() : null)
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : null)
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .notes(order.getNotes())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse mapItemToResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .productImageUrl(item.getProduct().getImageUrl())
                .build();
    }

    // ✅ THÊM METHOD MỚI vào cuối class OrderService

    @Transactional
    public OrderResponse createGuestOrder(GuestOrderRequest request) {
        // Tạo đơn hàng mới
        Order order = new Order();

        // ⚠️ QUAN TRỌNG: Không set user, chỉ set guestEmail
        order.setUser(null);

        order.setShippingAddress(request.getShippingAddress());
        order.setRecipientName(request.getRecipientName());
        order.setRecipientPhone(request.getRecipientPhone());
        order.setNotes(request.getNotes());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.PENDING);

        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(subtotal);

            order.addOrderItem(orderItem);
            orderItems.add(orderItem);

            totalPrice = totalPrice.add(subtotal);

            // Cập nhật stock
            productService.updateStock(product.getId(), item.getQuantity());
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        return mapToGuestOrderResponse(savedOrder);
    }

    private OrderResponse mapToGuestOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(null) // ← Guest không có userId
                .username("Guest") // ← Hiển thị "Guest"
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .notes(order.getNotes())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private PageResponse<OrderResponse> mapToPageResponse(Page<Order> orderPage) {
        List<OrderResponse> content = orderPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(content)
                .pageNumber(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .first(orderPage.isFirst())
                .build();
    }
}
