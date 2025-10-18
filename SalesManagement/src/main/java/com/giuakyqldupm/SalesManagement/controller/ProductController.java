// SalesManagement/src/main/java/com/giuakyqldupm/SalesManagement/controller/ProductController.java

package com.giuakyqldupm.SalesManagement.controller;

import com.giuakyqldupm.SalesManagement.dto.response.ApiResponse;
import com.giuakyqldupm.SalesManagement.dto.response.PageResponse;
import com.giuakyqldupm.SalesManagement.dto.response.ProductResponse;
import com.giuakyqldupm.SalesManagement.service.FileStorageService;
import com.giuakyqldupm.SalesManagement.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.giuakyqldupm.SalesManagement.exception.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product", description = "Product APIs")
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper objectMapper;

    // ============================================
    // PHƯƠNG THỨC CHÍNH - ĐÃ SỬA ĐỂ HỖ TRỢ FILTER
    // ============================================
    @GetMapping
    @Operation(summary = "Get all active products with pagination and filters")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllActiveProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) { // ← THÊM THAM SỐ NÀY

        PageResponse<ProductResponse> products;

        // LOGIC LỌC THEO THỨ TỰ ƯU TIÊN:
        // 1. Nếu có keyword → tìm kiếm
        // 2. Nếu có categoryId → lọc theo danh mục
        // 3. Còn lại → lấy tất cả

        if (keyword != null && !keyword.isBlank()) {
            // Tìm kiếm theo keyword
            products = productService.searchProducts(keyword, page, size);
        } else if (categoryId != null) {
            // Lọc theo danh mục - ĐÂY LÀ PHẦN QUAN TRỌNG
            products = productService.getProductsByCategory(categoryId, page, size);
        } else {
            // Lấy tất cả sản phẩm
            products = productService.getAllActiveProducts(page, size, sortBy, sortDir);
        }

        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    // ============================================
    // CÁC PHƯƠNG THỨC KHÁC GIỮ NGUYÊN
    // ============================================

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PageResponse<ProductResponse> products = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLatestProducts(
            @RequestParam(defaultValue = "8") int limit) {
        List<ProductResponse> products = productService.getLatestProducts(limit);
        return ResponseEntity.ok(ApiResponse.success("Latest products retrieved successfully", products));
    }

    @PostMapping("/upload-image")
    @Operation(summary = "Upload product image")
    public ResponseEntity<ApiResponse<String>> uploadProductImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", imageUrl));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product (admin)")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @ModelAttribute com.giuakyqldupm.SalesManagement.dto.request.ProductRequest request,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "product", required = false) String productJson) {

        if ((request.getCategoryId() == null) && productJson != null && !productJson.isBlank()) {
            try {
                com.giuakyqldupm.SalesManagement.dto.request.ProductRequest parsed = objectMapper.readValue(productJson,
                        com.giuakyqldupm.SalesManagement.dto.request.ProductRequest.class);
                request = parsed;
            } catch (JsonProcessingException e) {
                throw new BadRequestException("Invalid product JSON: " + e.getOriginalMessage());
            }
        }

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            request.setImageUrl("/uploads/" + fileName);
        }

        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new product (admin) - JSON")
    public ResponseEntity<ApiResponse<ProductResponse>> createProductJson(
            @Valid @RequestBody com.giuakyqldupm.SalesManagement.dto.request.ProductRequest request) {
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created successfully", product));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all products (admin)")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProductsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        PageResponse<ProductResponse> products = productService.getAllProducts(page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (admin)")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(@PathVariable Long id,
            @ModelAttribute com.giuakyqldupm.SalesManagement.dto.request.ProductRequest request,
            @RequestParam(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "product", required = false) String productJson) {

        if ((request.getCategoryId() == null) && productJson != null && !productJson.isBlank()) {
            try {
                com.giuakyqldupm.SalesManagement.dto.request.ProductRequest parsed = objectMapper.readValue(productJson,
                        com.giuakyqldupm.SalesManagement.dto.request.ProductRequest.class);
                request = parsed;
            } catch (JsonProcessingException e) {
                throw new BadRequestException("Invalid product JSON: " + e.getOriginalMessage());
            }
        }

        if (file != null && !file.isEmpty()) {
            ProductResponse existing = productService.getProductById(id);
            String existingImageUrl = existing.getImageUrl();
            if (existingImageUrl != null && !existingImageUrl.isBlank()) {
                String[] parts = existingImageUrl.split("/");
                String fileName = parts[parts.length - 1];
                fileStorageService.deleteFile(fileName);
            }
            String fileName = fileStorageService.storeFile(file);
            request.setImageUrl("/uploads/" + fileName);
        }

        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @PutMapping(value = "/{id}", consumes = { org.springframework.http.MediaType.APPLICATION_JSON_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update product (admin) - JSON")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProductJson(@PathVariable Long id,
            @Valid @RequestBody com.giuakyqldupm.SalesManagement.dto.request.ProductRequest request) {
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete product (admin)")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }
}