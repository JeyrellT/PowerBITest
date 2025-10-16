/**
 * progressValidator.js
 * Valida snapshots de progreso usando JSON Schema (AJV)
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../schemas/progress.schema.json';

class ProgressValidator {
  constructor() {
    const ajv = new Ajv({
      allErrors: true,
      strict: false,
      removeAdditional: false,
      useDefaults: false
    });

    addFormats(ajv);
    this.validator = ajv.compile(schema);
  }

  /**
   * Valida un snapshot completo de progreso.
   * @param {object} snapshot Snapshot con version, user y progress
   * @returns {{ valid: boolean, errors: Array }}
   */
  validate(snapshot) {
    const isValid = this.validator(snapshot);
    return {
      valid: isValid,
      errors: isValid ? [] : this.formatErrors(this.validator.errors)
    };
  }

  /**
   * Valida y lanza error si hay inconsistencias.
   * @param {object} snapshot
   */
  assertValid(snapshot) {
    const result = this.validate(snapshot);
    if (!result.valid) {
      const errorMessage = result.errors
        .map(err => `${err.instancePath || '(root)'} ${err.message}`.trim())
        .join('; ');
      const error = new Error(`Snapshot de progreso inválido: ${errorMessage}`);
      error.validationErrors = result.errors;
      throw error;
    }
  }

  formatErrors(errors = []) {
    return errors.map(error => ({
      keyword: error.keyword,
      instancePath: error.instancePath,
      schemaPath: error.schemaPath,
      message: error.message,
      params: error.params
    }));
  }
}

export const progressValidator = new ProgressValidator();
