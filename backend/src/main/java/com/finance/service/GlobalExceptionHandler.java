package com.finance.service;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.finance.exception.EntityNotFoundException;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
		
		// Get all errors
		List<String> errors = ex.getBindingResult().getFieldErrors().stream().map(x -> x.getDefaultMessage())
				.collect(Collectors.toList());
		
		return createDefaultErrorMessage("Payload is not valid", status, errors);
	}
	
	
	@ExceptionHandler(value= {EntityNotFoundException.class})
	protected ResponseEntity<Object> handleNotFoundException(Exception ex, WebRequest request){
        return createDefaultErrorMessage(ex, HttpStatus.NOT_FOUND);
    }

	@ExceptionHandler(value= {Exception.class})
	protected ResponseEntity<Object> handleInternalServerError(Exception ex, WebRequest request){
        return createDefaultErrorMessage("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
	
	
	private ResponseEntity<Object> createDefaultErrorMessage(Exception ex, HttpStatus status){
		return this.createDefaultErrorMessage(ex.getMessage(), status);
	}
	
	private ResponseEntity<Object> createDefaultErrorMessage(String description, HttpStatus status){
		return this.createDefaultErrorMessage(description, status, null);
	}
	
	private ResponseEntity<Object> createDefaultErrorMessage(String description, HttpStatus status, List<String> fieldErrors){
		
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", status.value());
		body.put("description", description);
		body.put("timestamp", new Date());
		
		if( fieldErrors != null && !fieldErrors.isEmpty()) {
			body.put("errors", fieldErrors);
		}

		return new ResponseEntity<>(body, status);
	}
}