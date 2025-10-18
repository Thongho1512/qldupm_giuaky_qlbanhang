package com.giuakyqldupm.SalesManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.giuakyqldupm.SalesManagement.entity.OrderItem;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT oi.product.id as productId, " +
            "oi.productName as productName, " +
            "SUM(oi.quantity) as totalQuantity, " +
            "SUM(oi.subtotal) as totalRevenue " +
            "FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.status IN ('COMPLETED', 'SHIPPING') " +
            "GROUP BY oi.product.id, oi.productName " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts(@Param("limit") int limit);

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi " +
            "JOIN oi.order o " +
            "WHERE o.status IN ('COMPLETED', 'SHIPPING')")
    Long getTotalProductsSold();
}
