package org.example.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pokemon {

    @Id
    private Long id;

    private String name;

    private String baseExperience;

    private String imageUrl;

    @OneToMany(mappedBy = "pokemon", cascade = CascadeType.ALL)
    private List<AccessLog> accessLogs;
}