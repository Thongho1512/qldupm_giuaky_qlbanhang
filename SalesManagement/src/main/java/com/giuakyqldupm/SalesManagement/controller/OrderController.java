package com.giuakyqldupm.SalesManagement.controller;

import com.giuakyqldupm.SalesManagement.dto.request.GuestOrderRequest;
import com.giuakyqldupm.SalesManagement.dto.request.OrderRequest;
import com.giuakyqldupm.SalesManagement.dto.response.ApiResponse;
import com.giuakyqldupm.SalesManagement.dto.response.OrderResponse;
import com.giuakyqldupm.SalesManagement.dto.response.PageResponse;
import com.giuakyqldupm.SalesManagement.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order", description = "Order APIs")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create new order")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        OrderResponse order = orderService.createOrder(userDetails.getUsername(), request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", order));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Get current user's orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageResponse<OrderResponse> orders = orderService.getOrdersByUser(userDetails.getUsername(), page, size);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        OrderResponse order = orderService.getOrderById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel order")
    public ResponseEntity<ApiResponse<String>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        orderService.cancelOrder(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", null));
    }

    // ============ ADMIN ORDER MANAGEMENT ============
    @GetMapping("/admin")
    @Operation(summary = "Get all orders (admin)")
    public ResponseEntity<ApiResponse<com.giuakyqldupm.SalesManagement.dto.response.PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        com.giuakyqldupm.SalesManagement.dto.response.PageResponse<OrderResponse> orders = orderService
                .getAllOrders(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    @GetMapping("/admin/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get orders by status (admin)")
    public ResponseEntity<ApiResponse<com.giuakyqldupm.SalesManagement.dto.response.PageResponse<OrderResponse>>> getOrdersByStatusAdmin(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        com.giuakyqldupm.SalesManagement.dto.response.PageResponse<OrderResponse> orders = orderService
                .getOrdersByStatus(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    // NOTE: searching is supported via optional 'keyword' parameter on the admin
    // GET /api/orders endpoint

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update order status (admin)")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatusAdmin(@PathVariable Long id,
            @Valid @RequestBody com.giuakyqldupm.SalesManagement.dto.request.UpdateOrderStatusRequest request) {
        OrderResponse order = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }

    @PostMapping("/guest")
    @Operation(summary = "Create order for guest (no authentication required)")
    public ResponseEntity<ApiResponse<OrderResponse>> createGuestOrder(
            @Valid @RequestBody GuestOrderRequest request) {
        OrderResponse order = orderService.createGuestOrder(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created successfully", order));
    }
}
