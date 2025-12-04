package com.chargeonhome.backend.controller;

import com.chargeonhome.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "http://localhost:4200")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Verificar conexión a la base de datos
            long usuarioCount = usuarioRepository.count();
            
            response.put("status", "OK");
            response.put("database", "CONNECTED");
            response.put("message", "Conexión a Supabase exitosa");
            response.put("usuarios_en_db", usuarioCount);
            response.put("timestamp", System.currentTimeMillis());
            
            logger.info("Health check exitoso. Usuarios en DB: {}", usuarioCount);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en health check: ", e);
            response.put("status", "ERROR");
            response.put("database", "DISCONNECTED");
            response.put("message", "Error al conectar con la base de datos: " + e.getMessage());
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/db-test")
    public ResponseEntity<Map<String, Object>> databaseTest() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Intentar una consulta simple
            long count = usuarioRepository.count();
            
            response.put("success", true);
            response.put("message", "Conexión a Supabase verificada correctamente");
            response.put("total_usuarios", count);
            response.put("database_type", "PostgreSQL (Supabase)");
            
            logger.info("Test de base de datos exitoso. Total usuarios: {}", count);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error en test de base de datos: ", e);
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            response.put("error_type", e.getClass().getSimpleName());
            
            return ResponseEntity.status(500).body(response);
        }
    }
}

