package com.giuakyqldupm.SalesManagement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.giuakyqldupm.SalesManagement.entity.Product;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByStatus(Product.ProductStatus status, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE'")
    Page<Product> findAllActiveProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "p.status = 'ACTIVE' AND (" +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProducts(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "p.status = 'ACTIVE' AND " +
            "p.category.id = :categoryId AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchProductsByCategory(@Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ACTIVE' AND p.price BETWEEN :minPrice AND :maxPrice")
    Page<Product> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);

    List<Product> findTop10ByStatusOrderByCreatedAtDesc(Product.ProductStatus status);

    Long countByStatus(Product.ProductStatus status);
}
