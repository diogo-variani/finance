package com.finance.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.ValidationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.finance.exception.EntityNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	private final static Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
	
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
		
		List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
		List<ObjectError> globalErrors = ex.getBindingResult().getGlobalErrors();
		
		List<String> errors = new ArrayList<String>();
		errors.addAll( fieldErrors.stream().map( x -> x.getDefaultMessage() ).collect(Collectors.toList()) );
		errors.addAll( globalErrors.stream().map( x -> x.getDefaultMessage() ).collect(Collectors.toList()) );
		
		return createDefaultErrorMessage("Payload is not valid", status, errors);
	}
	
	@ExceptionHandler(value= {ValidationException.class})
	protected ResponseEntity<Object> handleValidationException(ValidationException ex, WebRequest request){
        return createDefaultErrorMessage(ex, HttpStatus.BAD_REQUEST);
    }
	
	@ExceptionHandler(value= {AccessDeniedException.class})
	protected ResponseEntity<Object> handleValidationException(AccessDeniedException ex, WebRequest request){
        return createDefaultErrorMessage(ex, HttpStatus.FORBIDDEN);
    }
	
	@ExceptionHandler(value= {EntityNotFoundException.class})
	protected ResponseEntity<Object> handleNotFoundException(EntityNotFoundException ex, WebRequest request){
        return createDefaultErrorMessage(ex, HttpStatus.NOT_FOUND);
    }
	
	@ExceptionHandler(value= {AuthenticationCredentialsNotFoundException.class})
	protected ResponseEntity<Object> handleNotFoundException(AuthenticationCredentialsNotFoundException ex, WebRequest request){
        return createDefaultErrorMessage(ex, HttpStatus.UNAUTHORIZED);
    }

	@ExceptionHandler(value= {Exception.class})
	protected ResponseEntity<Object> handleInternalServerError(Exception ex, WebRequest request){
		
		logger.error(ex.getMessage(), ex);
		
        return createDefaultErrorMessage("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
	
	
	private ResponseEntity<Object> createDefaultErrorMessage(Exception ex, HttpStatus status){
		return this.createDefaultErrorMessage(ex.getMessage(), status);
	}
	
	private ResponseEntity<Object> createDefaultErrorMessage(String description, HttpStatus status){
		return this.createDefaultErrorMessage(description, status, null);
	}
	
	private ResponseEntity<Object> createDefaultErrorMessage(String description, HttpStatus status, List<String> errors){
		
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", status.value());
		body.put("description", description);
		body.put("timestamp", new Date());
		
		if( errors != null && !errors.isEmpty()) {
			body.put("errors", errors);
		}

		return new ResponseEntity<>(body, status);
	}
}