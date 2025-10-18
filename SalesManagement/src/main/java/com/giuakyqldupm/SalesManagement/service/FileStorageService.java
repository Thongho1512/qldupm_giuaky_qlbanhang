package com.giuakyqldupm.SalesManagement.service;

import com.giuakyqldupm.SalesManagement.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private final Path fileStorageLocation;

    // allowed extensions
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "webp", "bmp", "jfif");

    // max size 5MB
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new BadRequestException("Could not create the directory where the uploaded files will be stored.");
        }
    }

    /**
     * Store the file, validate extension and size. Returns the saved file name (not
     * URL).
     */
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 5MB");
        }

        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        if (originalFileName.contains("..")) {
            throw new BadRequestException("Invalid file path: " + originalFileName);
        }

        // try to derive extension from filename
        String fileExtension = "";
        int dotIndex = originalFileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < originalFileName.length() - 1) {
            fileExtension = originalFileName.substring(dotIndex + 1).toLowerCase();
        }

        // if missing or suspicious, fall back to content type
        if (fileExtension.isEmpty() || fileExtension.length() > 5) {
            String contentType = file.getContentType();
            if (contentType != null) {
                contentType = contentType.toLowerCase();
                if (contentType.contains("/")) {
                    String candidate = contentType.substring(contentType.indexOf('/') + 1);
                    // handle image/jpg vs image/jpeg
                    if (candidate.equals("jpeg"))
                        candidate = "jpg";
                    if (candidate.equals("pjpeg"))
                        candidate = "jpg";
                    if (candidate.equals("x-png"))
                        candidate = "png";
                    if (candidate.equals("jfif"))
                        candidate = "jpg";
                    fileExtension = candidate;
                }
            }
        }

        if (fileExtension.equals("jpeg"))
            fileExtension = "jpg";
        if (fileExtension.equals("jfif"))
            fileExtension = "jpg";

        log.debug("Original filename: {} | detected extension: {} | contentType: {}", originalFileName, fileExtension,
                file.getContentType());

        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new BadRequestException("Invalid file type. Allowed types: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        String saveExtension = fileExtension.equals("jfif") ? "jpg" : fileExtension;
        String newFileName = UUID.randomUUID().toString() + "." + saveExtension;

        try {
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return newFileName;
        } catch (IOException ex) {
            log.error("Could not store file {}: {}", originalFileName, ex.getMessage());
            throw new BadRequestException("Could not store file: " + ex.getMessage());
        }
    }

    public void deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.error("Could not delete file: {} - {}", fileName, ex.getMessage());
        }
    }
}
