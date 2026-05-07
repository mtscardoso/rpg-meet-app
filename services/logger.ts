/**
 * Logger Estruturado para Jitsi
 * Versão: 1.0
 */

import type { LogEntry, LogLevel } from '@/types/jitsi';

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogLevel, component: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
    };

    this.logs.push(entry);

    // Manter apenas os últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Imprimir no console
    const prefix = `[${entry.timestamp}] [${level}] [${component}]`;
    switch (level) {
      case 'DEBUG':
        console.debug(prefix, message, data);
        break;
      case 'INFO':
        console.info(prefix, message, data);
        break;
      case 'WARN':
        console.warn(prefix, message, data);
        break;
      case 'ERROR':
        console.error(prefix, message, data);
        break;
    }
  }

  debug(component: string, message: string, data?: any) {
    this.log('DEBUG' as LogLevel, component, message, data);
  }

  info(component: string, message: string, data?: any) {
    this.log('INFO' as LogLevel, component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log('WARN' as LogLevel, component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log('ERROR' as LogLevel, component, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter(log => log.component === component);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clear() {
    this.logs = [];
  }
}

// Instância global
export const logger = new Logger();
