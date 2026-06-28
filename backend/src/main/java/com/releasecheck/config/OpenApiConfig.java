package com.releasecheck.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger metadata. springdoc serves the interactive UI at
 * {@code /swagger-ui.html} and the spec at {@code /v3/api-docs}.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI releaseCheckOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Release Checklist API")
                .version("1.0.0")
                .description("REST API for tracking software releases and their checklist progress. "
                        + "Release status (PLANNED / ONGOING / DONE) is computed from completed steps "
                        + "and is never stored.")
                .contact(new Contact().name("ReleaseCheck"))
                .license(new License().name("MIT")));
    }
}
