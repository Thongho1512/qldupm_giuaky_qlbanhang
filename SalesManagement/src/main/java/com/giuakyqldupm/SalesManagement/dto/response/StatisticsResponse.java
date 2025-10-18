package com.giuakyqldupm.SalesManagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {

    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalProducts;
    private Long pendingOrders;
    private Long shippingOrders;
    private Long completedOrders;
    private Long cancelledOrders;
    private List<TopSellingProduct> topSellingProducts;
    private Map<String, BigDecimal> revenueByDate;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopSellingProduct {
        private Long productId;
        private String productName;
        private Long totalQuantitySold;
        private BigDecimal totalRevenue;
    }
}