package com.giuakyqldupm.SalesManagement.controller;

import com.giuakyqldupm.SalesManagement.dto.response.ApiResponse;
import com.giuakyqldupm.SalesManagement.dto.response.StatisticsResponse;
import com.giuakyqldupm.SalesManagement.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
