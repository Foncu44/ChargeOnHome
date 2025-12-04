package com.chargeonhome.backend.repository;

import com.chargeonhome.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByGarajeId(Long garajeId);

    List<Reserva> findByGarajePropietarioId(Long propietarioId);
}
