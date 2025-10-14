package com.chargeonhome.backend.controller;

import com.chargeonhome.backend.dto.LoginRequest;
import com.chargeonhome.backend.dto.RegistroRequest;
import com.chargeonhome.backend.dto.AuthResponse;
import com.chargeonhome.backend.dto.UsuarioResponse;
import com.chargeonhome.backend.model.Usuario;
import com.chargeonhome.backend.model.TipoUsuario;
import com.chargeonhome.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroRequest request) {
        try {
            logger.info("Intentando registrar usuario con email: {}", request.getEmail());
            
            // Verificar si el email ya existe
            if (usuarioService.existeEmail(request.getEmail())) {
                logger.warn("Email ya existe: {}", request.getEmail());
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "El email ya está registrado", false));
            }

            // Crear nuevo usuario
            Usuario usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setApellidos(request.getApellidos());
            usuario.setEmail(request.getEmail());
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            usuario.setTelefono(request.getTelefono());
            
            // Convertir string a enum
            TipoUsuario tipoUsuario;
            switch (request.getTipoUsuario().toUpperCase()) {
                case "PROPIETARIO":
                    tipoUsuario = TipoUsuario.PROPIETARIO;
                    break;
                case "CLIENTE":
                    tipoUsuario = TipoUsuario.CLIENTE;
                    break;
                case "AMBOS":
                    tipoUsuario = TipoUsuario.AMBOS;
                    break;
                default:
                    tipoUsuario = TipoUsuario.CLIENTE;
            }
            usuario.setTipoUsuario(tipoUsuario);

            // Guardar usuario
            Usuario usuarioGuardado = usuarioService.guardar(usuario);
            logger.info("Usuario registrado exitosamente con ID: {}", usuarioGuardado.getId());

            // Crear respuesta con información del usuario
            UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuarioGuardado.getId(),
                usuarioGuardado.getNombre(),
                usuarioGuardado.getApellidos(),
                usuarioGuardado.getEmail(),
                usuarioGuardado.getTelefono(),
                usuarioGuardado.getTipoUsuario(),
                usuarioGuardado.getVerificado(),
                usuarioGuardado.getFechaRegistro()
            );

            return ResponseEntity.ok(new AuthResponse(
                "token_temporal", 
                "Usuario registrado correctamente", 
                true,
                usuarioResponse
            ));

        } catch (Exception e) {
            logger.error("Error en registro: ", e);
            return ResponseEntity.badRequest()
                .body(new AuthResponse(null, "Error al registrar usuario: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            logger.info("Intentando login con email: {}", request.getEmail());
            
            Usuario usuario = usuarioService.buscarPorEmail(request.getEmail());
            
            if (usuario == null) {
                logger.warn("Usuario no encontrado: {}", request.getEmail());
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Email o contraseña incorrectos", false));
            }

            logger.info("Usuario encontrado: {}, verificando contraseña", usuario.getEmail());
            
            if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
                logger.warn("Contraseña incorrecta para usuario: {}", request.getEmail());
                return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, "Email o contraseña incorrectos", false));
            }

            logger.info("Login exitoso para usuario: {}", usuario.getEmail());

            // Crear respuesta con información del usuario
            UsuarioResponse usuarioResponse = new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getTipoUsuario(),
                usuario.getVerificado(),
                usuario.getFechaRegistro()
            );

            return ResponseEntity.ok(new AuthResponse(
                "token_temporal", 
                "Login exitoso", 
                true,
                usuarioResponse
            ));

        } catch (Exception e) {
            logger.error("Error en login: ", e);
            return ResponseEntity.status(500)
                .body(new AuthResponse(null, "Error interno del servidor: " + e.getMessage(), false));
        }
    }
} 