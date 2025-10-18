package com.giuakyqldupm.SalesManagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.nio.file.Path;

@Configuration
public class FileUploadConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        try {
            Path p = Path.of(uploadDir).toAbsolutePath().normalize();
            File dir = p.toFile();
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String location = p.toUri().toString(); // file:///...
            registry.addResourceHandler("/uploads/**")
                    .addResourceLocations(location);
        } catch (Exception ex) {
            // if any problem, fall back to relative path
            String fallback = "file:" + uploadDir + "/";
            registry.addResourceHandler("/uploads/**").addResourceLocations(fallback);
        }
    }
}
