package com.giuakyqldupm.SalesManagement.service;

import com.giuakyqldupm.SalesManagement.dto.response.StatisticsResponse;
import com.giuakyqldupm.SalesManagement.repository.OrderRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.StoredProcedureQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    @PersistenceContext
    private EntityManager entityManager;

    public StatisticsResponse getDashboardStatistics() {

        // =============================================
        // GỌI STORED PROCEDURE (1 lần gọi duy nhất)
        // =============================================
        StoredProcedureQuery query = entityManager
                .createStoredProcedureQuery("sp_GetDashboardStatistics");

        // Thực thi
        query.execute();

        // =============================================
        // XỬ LÝ RESULT SET 1: Thống kê tổng quan
        // =============================================
        List<Object[]> overviewResults = query.getResultList();
        Object[] overview = overviewResults.get(0);

        Long totalOrders = ((Number) overview[0]).longValue();
        Long pendingOrders = ((Number) overview[1]).longValue();
        Long shippingOrders = ((Number) overview[2]).longValue();
        Long completedOrders = ((Number) overview[3]).longValue();
        Long cancelledOrders = ((Number) overview[4]).longValue();
        BigDecimal totalRevenue = (BigDecimal) overview[5];
        Long totalCustomers = ((Number) overview[6]).longValue();
        Long totalProducts = ((Number) overview[7]).longValue();

        // =============================================
        // XỬ LÝ RESULT SET 2: Top sản phẩm
        // =============================================
        query.hasMoreResults(); // Di chuyển đến result set tiếp theo
        List<Object[]> topProductsResults = query.getResultList();

        List<StatisticsResponse.TopSellingProduct> topSellingProducts = new ArrayList<>();

        for (Object[] row : topProductsResults) {
            StatisticsResponse.TopSellingProduct product = StatisticsResponse.TopSellingProduct.builder()
                    .productId(((Number) row[0]).longValue())
                    .productName((String) row[1])
                    .totalQuantitySold(((Number) row[2]).longValue())
                    .totalRevenue((BigDecimal) row[3])
                    .build();
            topSellingProducts.add(product);
        }

        // =============================================
        // XỬ LÝ RESULT SET 3: Doanh thu theo ngày
        // =============================================
        query.hasMoreResults(); // Di chuyển đến result set tiếp theo
        List<Object[]> revenueResults = query.getResultList();

        Map<String, BigDecimal> revenueByDate = new LinkedHashMap<>();
        for (Object[] row : revenueResults) {
            String dateKey = (String) row[0];
            BigDecimal revenue = (BigDecimal) row[1];
            revenueByDate.put(dateKey, revenue);
        }

        // =============================================
        // TẠO VÀ TRẢ VỀ RESPONSE
        // =============================================
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

}
