package com.giuakyqldupm.SalesManagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDING|SHIPPING|COMPLETED|CANCELLED", message = "Status must be PENDING, SHIPPING, COMPLETED, or CANCELLED")
    private String status;
}