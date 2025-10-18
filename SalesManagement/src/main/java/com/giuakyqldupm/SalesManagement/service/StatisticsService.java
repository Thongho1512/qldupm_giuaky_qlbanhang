package com.giuakyqldupm.SalesManagement.service;

import com.giuakyqldupm.SalesManagement.dto.response.StatisticsResponse;
import com.giuakyqldupm.SalesManagement.entity.Order;
import com.giuakyqldupm.SalesManagement.repository.OrderItemRepository;
import com.giuakyqldupm.SalesManagement.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserService userService;
    private final ProductService productService;

    public StatisticsResponse getDashboardStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        BigDecimal totalRevenue = orderRepository.calculateRevenueBetweenDates(
                startOfMonth, now);

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        Long totalOrders = orderRepository.count();
        Long totalCustomers = userService.getTotalCustomers();
        Long totalProducts = productService.getTotalProducts();

        Long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.PENDING);
        Long shippingOrders = orderRepository.countByStatus(Order.OrderStatus.SHIPPING);
        Long completedOrders = orderRepository.countByStatus(Order.OrderStatus.COMPLETED);
        Long cancelledOrders = orderRepository.countByStatus(Order.OrderStatus.CANCELLED);

        List<StatisticsResponse.TopSellingProduct> topSellingProducts = getTopSellingProducts(10);

        Map<String, BigDecimal> revenueByDate = getRevenueByDate(startOfMonth, now);

        return StatisticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .pendingOrders(pendingOrders)
                .shippingOrders(shippingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .topSellingProducts(topSellingProducts)
                .revenueByDate(revenueByDate)
                .build();
    }

    public StatisticsResponse getStatisticsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal totalRevenue = orderRepository.calculateRevenueBetweenDates(startDate, endDate);

        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        List<Order> orders = orderRepository.findOrdersBetweenDates(startDate, endDate);

        Long totalOrders = (long) orders.size();
        Long pendingOrders = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.PENDING).count();
        Long shippingOrders = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.SHIPPING).count();
        Long completedOrders = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.COMPLETED).count();
        Long cancelledOrders = orders.stream().filter(o -> o.getStatus() == Order.OrderStatus.CANCELLED).count();

        List<StatisticsResponse.TopSellingProduct> topSellingProducts = getTopSellingProducts(10);
        Map<String, BigDecimal> revenueByDate = getRevenueByDate(startDate, endDate);

        return StatisticsResponse.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(userService.getTotalCustomers())
                .totalProducts(productService.getTotalProducts())
                .pendingOrders(pendingOrders)
                .shippingOrders(shippingOrders)
                .completedOrders(completedOrders)
                .cancelledOrders(cancelledOrders)
                .topSellingProducts(topSellingProducts)
                .revenueByDate(revenueByDate)
                .build();
    }

    private List<StatisticsResponse.TopSellingProduct> getTopSellingProducts(int limit) {
        List<Object[]> results = orderItemRepository.findTopSellingProducts(limit);

        List<StatisticsResponse.TopSellingProduct> topProducts = new ArrayList<>();

        for (Object[] result : results) {
            StatisticsResponse.TopSellingProduct product = StatisticsResponse.TopSellingProduct.builder()
                    .productId(((Number) result[0]).longValue())
                    .productName((String) result[1])
                    .totalQuantitySold(((Number) result[2]).longValue())
                    .totalRevenue((BigDecimal) result[3])
                    .build();
            topProducts.add(product);
        }

        return topProducts.stream().limit(limit).collect(Collectors.toList());
    }

    private Map<String, BigDecimal> getRevenueByDate(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findOrdersBetweenDates(startDate, endDate);

        Map<String, BigDecimal> revenueMap = new TreeMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (Order order : orders) {
            String dateKey = order.getCreatedAt().format(formatter);
            revenueMap.merge(dateKey, order.getTotalPrice(), BigDecimal::add);
        }

        return revenueMap;
    }
}
