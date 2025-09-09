const monitor = require('./monitor');

class DataProcessor {
  constructor() {
    // Rangos para generación de valores random y validación
    this.medicalRanges = {
      controlTemp: { min: 36.0, max: 40.0, decimals: 1 },
      peso: { min: 400, max: 4500, decimals: 1 },
      tempCorporal: { min: 0, max: 60.0, decimals: 1 },
      saturacion: { min: 85, max: 100, decimals: 0 }
    };

    // Opciones de modo
    this.modeOptions = ['Precalentado', 'Manual', 'Bebe'];
  }

  /**
   * Genera valores aleatorios para todos los campos de una fila
   * @returns {Object} Objeto con datos aleatorios
   */
  generateRandomRowData() {
    const randomData = {
      controlTemp: this._getRandomInRange('controlTemp'),
      peso: this._getRandomInRange('peso'),
      tempCorporal: this._getRandomInRange('tempCorporal'),
      saturacion: this._getRandomInRange('saturacion'),
      modo: this._getRandomMode()
    };

    monitor.logRandomGeneration(randomData);
    return randomData;
  }

  /**
   * Validación completa de datos médicos con manejo de strings/numbers
   * @param {Object} data - Datos médicos a validar
   * @returns {Object} { valid: boolean, errors: Array }
   */
  validateMedicalData(data) {
    const errors = [];
    
    // Convertir valores a números si son strings
    const controlTempe = this._parseValue(data.controlTempe || data.controlTemp);
    const tempCorporal = this._parseValue(data.tempCorporal);
    const saturacion = this._parseValue(data.saturacion);
    const pesoKg = this._parseValue(data.pesoKg || data.peso);
    const modoSeleccion = data.modoSeleccion || data.modo;

    // Validar temperatura control (36-40°C)
    if (isNaN(controlTempe)) {
      errors.push('Temperatura control no es un número válido');
    } else if (controlTempe < this.medicalRanges.controlTemp.min || 
               controlTempe > this.medicalRanges.controlTemp.max) {
      errors.push(`Temperatura control debe estar entre ${this.medicalRanges.controlTemp.min} y ${this.medicalRanges.controlTemp.max}°C`);
    }

    // Validar temperatura corporal (35-42°C)
    if (isNaN(tempCorporal)) {
      errors.push('Temperatura corporal no es un número válido');
    } else if (tempCorporal < this.medicalRanges.tempCorporal.min || 
               tempCorporal > this.medicalRanges.tempCorporal.max) {
      errors.push(`Temperatura corporal debe estar entre ${this.medicalRanges.tempCorporal.min} y ${this.medicalRanges.tempCorporal.max}°C`);
    }

    // Validar saturación (85-100%)
    if (isNaN(saturacion)) {
      errors.push('Saturación de oxígeno no es un número válido');
    } else if (saturacion < this.medicalRanges.saturacion.min || 
               saturacion > this.medicalRanges.saturacion.max) {
      errors.push(`Saturación debe estar entre ${this.medicalRanges.saturacion.min} y ${this.medicalRanges.saturacion.max}%`);
    }

    // Validar peso (0-100 kg)
    if (isNaN(pesoKg)) {
      errors.push('Peso no es un número válido');
    } else if (pesoKg < this.medicalRanges.peso.min || 
               pesoKg > this.medicalRanges.peso.max) {
      errors.push(`Peso debe estar entre ${this.medicalRanges.peso.min} y ${this.medicalRanges.peso.max} kg`);
    }

    // Validar modo
    if (!this.modeOptions.includes(modoSeleccion)) {
      errors.push(`Modo selección debe ser uno de: ${this.modeOptions.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      parsedData: {
        controlTempe,
        tempCorporal,
        saturacion,
        pesoKg,
        modoSeleccion
      }
    };
  }

  /**
   * Transforma datos para la vista del estudiante
   * @param {Object} data - Datos del profesor
   * @returns {Object} Datos formateados para el estudiante
   */
  transformForStudent(data) {
    const validation = this.validateMedicalData(data);
    if (!validation.valid) {
      throw new Error(`Datos inválidos: ${validation.errors.join(', ')}`);
    }

    return {
      temperaturaControl: validation.parsedData.controlTempe,
      peso: validation.parsedData.pesoKg,
      temperaturaCorporal: validation.parsedData.tempCorporal,
      saturacionOxigeno: validation.parsedData.saturacion,
      modo: validation.parsedData.modoSeleccion,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validación básica (compatibilidad hacia atrás)
   * @param {Object} data - Datos a validar
   * @returns {boolean} True si los datos son válidos
   */
  validateData(data) {
    const result = this.validateMedicalData(data);
    return result.valid;
  }

  // --- Helpers privados ---

  _parseValue(value) {
    if (typeof value === 'string') {
      // Eliminar cualquier caracter no numérico excepto punto decimal
      const cleaned = value.replace(/[^\d.-]/g, '');
      return parseFloat(cleaned);
    }
    return Number(value);
  }

  _getRandomInRange(field) {
    const range = this.medicalRanges[field];
    const value = Math.random() * (range.max - range.min) + range.min;
    return parseFloat(value.toFixed(range.decimals));
  }

  _getRandomMode() {
    const randomIndex = Math.floor(Math.random() * this.modeOptions.length);
    return this.modeOptions[randomIndex];
  }

  _validateRange(value, field) {
    const range = this.medicalRanges[field];
    const numValue = this._parseValue(value);
    return !isNaN(numValue) && numValue >= range.min && numValue <= range.max;
  }
}

module.exports = new DataProcessor();