package com.giuakyqldupm.SalesManagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.giuakyqldupm.SalesManagement.entity.Order;
import java.util.List;
import java.util.Map;

@Repository
public interface StatisticsRepository extends JpaRepository<Order, Long> {

    // Gọi stored procedure trả về multiple result sets
    @Query(value = "EXEC sp_GetDashboardStatistics", nativeQuery = true)
    List<Map<String, Object>> getDashboardStatistics();
}