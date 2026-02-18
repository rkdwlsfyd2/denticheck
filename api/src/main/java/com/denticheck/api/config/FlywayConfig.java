package com.denticheck.api.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("local") // Only run on local to avoid wiping prod DB
public class FlywayConfig {

    /** local에서는 clean 없이 migrate만 실행해, load_dentals.py 등으로 적재한 데이터가 재시작 후에도 유지되도록 함. */
    @Bean
    public FlywayMigrationStrategy cleanMigrateStrategy() {
        return flyway -> flyway.migrate();
    }
}
