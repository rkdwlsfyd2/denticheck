package com.denticheck.api.config;

import graphql.GraphqlErrorBuilder;
import graphql.GraphQLError;
import graphql.scalars.ExtendedScalars;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.execution.DataFetcherExceptionResolverAdapter;
import org.springframework.graphql.execution.RuntimeWiringConfigurer;

@Configuration
public class GraphqlConfig {
    @Bean
    public RuntimeWiringConfigurer runtimeWiringConfigurer() {
        return wiringBuilder -> wiringBuilder
                .scalar(ExtendedScalars.DateTime)
                .scalar(ExtendedScalars.GraphQLLong);
    }

    /** Resolver/Service 예외를 클라이언트에 읽기 쉬운 메시지로 전달 (INTERNAL_ERROR 대신) */
    @Bean
    public DataFetcherExceptionResolverAdapter graphQlExceptionResolver() {
        return new DataFetcherExceptionResolverAdapter() {
            @Override
            protected GraphQLError resolveToSingleError(Throwable ex, graphql.schema.DataFetchingEnvironment env) {
                String message = ex.getMessage() != null && !ex.getMessage().isBlank()
                        ? ex.getMessage()
                        : "요청 처리 중 오류가 발생했어요.";
                return GraphqlErrorBuilder.newError(env)
                        .message(message)
                        .build();
            }
        };
    }
}
