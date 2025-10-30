package com.giuakyqldupm.SalesManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.giuakyqldupm.SalesManagement.entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

        Page<Order> findByUserId(Long userId, Pageable pageable);

        Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE " +
                        "o.user.username LIKE %:keyword% OR " +
                        "o.recipientName LIKE %:keyword% OR " +
                        "o.recipientPhone LIKE %:keyword% OR " +
                        "CAST(o.id AS string) LIKE %:keyword%")
        Page<Order> searchOrders(@Param("keyword") String keyword, Pageable pageable);

        @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status")
        Page<Order> findByUserIdAndStatus(@Param("userId") Long userId,
                        @Param("status") Order.OrderStatus status,
                        Pageable pageable);

        @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE " +
                        "o.status IN ('COMPLETED', 'SHIPPING') AND " +
                        "o.createdAt BETWEEN :startDate AND :endDate")
        BigDecimal calculateRevenueBetweenDates(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
        Long countByStatus(@Param("status") Order.OrderStatus status);

        @Query("SELECT o FROM Order o WHERE " +
                        "o.createdAt BETWEEN :startDate AND :endDate AND " +
                        "o.status IN ('COMPLETED', 'SHIPPING')")
        List<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);
}