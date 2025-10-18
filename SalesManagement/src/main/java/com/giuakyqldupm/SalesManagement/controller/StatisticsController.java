package com.giuakyqldupm.SalesManagement.controller;

import com.giuakyqldupm.SalesManagement.dto.response.ApiResponse;
import com.giuakyqldupm.SalesManagement.dto.response.StatisticsResponse;
import com.giuakyqldupm.SalesManagement.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Statistics", description = "Statistics APIs")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<ApiResponse<StatisticsResponse>> getDashboardStatistics() {
        StatisticsResponse statistics = statisticsService.getDashboardStatistics();
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", statistics));
    }

    @GetMapping("/date-range")
    @Operation(summary = "Get statistics by date range")
    public ResponseEntity<ApiResponse<StatisticsResponse>> getStatisticsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        StatisticsResponse statistics = statisticsService.getStatisticsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved successfully", statistics));
    }
}
