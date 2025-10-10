# **Proyecto de Simulación Médica - Cuna Radiante**

📋 **Descripción del Proyecto**  
Proyecto de Simulación Médica es una plataforma educativa avanzada desarrollada específicamente para instituciones universitarias. Facilita el aprendizaje práctico en entornos médicos simulados mediante una arquitectura cliente-servidor robusta que permite la interacción en tiempo real entre profesores y estudiantes.

La aplicación simula parámetros fisiológicos críticos como **temperatura corporal**, **saturación de oxígeno** y **peso**, proporcionando una experiencia educativa inmersiva y controlada. Soporta múltiples grupos de trabajo simultáneos, generación de **reportes automatizados** y un sistema de **alarmas para valores críticos**, haciendo de esta herramienta un recurso invaluable para la formación médica moderna.

<img width="2441" height="1768" alt="Arquitectura" src="https://github.com/user-attachments/assets/555dc03e-1e50-4bd2-8fe5-55ec410748dd" />

Este diagrama muestra la arquitectura **cliente-servidor**, donde tanto **profesores** como **estudiantes** acceden a través de interfaces web construidas con **Ionic/Angular**.  
El **backend en Node.js** gestiona las conexiones mediante **WebSockets**, almacena datos temporalmente en memoria y genera reportes.  
La **comunicación bidireccional** permite actualizaciones en tiempo real.

## **🎯 Características Principales - Módulo Profesor**

El **módulo del profesor** ofrece un **panel de control completo** para la gestión educativa, permitiendo crear sesiones personalizadas con **códigos de acceso únicos de 7 dígitos**.  

Los educadores pueden **enviar parámetros médicos específicos** a grupos individuales o de manera masiva, seleccionando entre **tres modos de operación especializados**.  

El sistema incluye funcionalidades avanzadas como:  
- **Generación de valores aleatorios** para prácticas.  
- **Bloqueo remoto** de interfaces estudiantiles.  
- **Generación de reportes detallados** en formato Excel.  

La interfaz proporciona **monitoreo en tiempo real** del estado de conexión de todos los grupos, facilitando la **gestión del aula virtual**.

<img width="2597" height="1937" alt="diagrama de secuencia" src="https://github.com/user-attachments/assets/44e36f61-956d-4047-a4ef-b601b993fd28" />

Este diagrama de secuencia ilustra el flujo de interacción entre **profesor**, **servidor** y **estudiante**.  
Comienza con la **activación de la sesión**, sigue con el **envío de parámetros médicos** y finaliza con la **generación de reportes**, mostrando la **comunicación sincronizada** entre todos los componentes.

## **🎓 Características Principales - Módulo Estudiante**

La **interfaz estudiantil** está diseñada específicamente para el aprendizaje práctico, presentando una **simulación realista de controles médicos** con retroalimentación visual inmediata.  
Los estudiantes ingresan mediante **códigos de sesión** proporcionados por el profesor, accediendo a una pantalla con **cuatro parámetros médicos principales** y un **cronómetro integrado**.  

El sistema incluye **mecanismos de validación de rangos médicos realistas** y activa **alarmas sonoras y visuales** cuando los valores entran en zonas críticas.  
La interfaz responde dinámicamente a los cambios enviados por el profesor, permitiendo a los estudiantes **practicar la interpretación de signos vitales** en un entorno **seguro y controlado**.

<img width="499" height="943" alt="Diagrama de estados" src="https://github.com/user-attachments/assets/27c06eed-ba87-4f3f-821d-ba4aa3d0f815" />

Este diagrama de estados muestra el **ciclo de vida de la conexión estudiantil**, desde la **desconexión inicial** hasta la **recepción de datos**, **validación** y **posibles estados de alarma**.  
Ilustra cómo el sistema maneja diferentes escenarios durante la simulación.

## **🛠 Tecnologías Utilizadas - Frontend**

El **frontend** está desarrollado utilizando **Ionic Framework** combinado con **Angular**, proporcionando una **aplicación web progresiva (PWA)** altamente **responsive** y **multiplataforma**.  

**TypeScript** asegura un código **mantenible y robusto**, mientras que **SCSS** permite un **diseño visual coherente** y adaptable a diferentes dispositivos.  
**Socket.io Client** gestiona la **comunicación bidireccional** con el servidor, asegurando **actualizaciones en tiempo real** sin necesidad de recargas.  

La **arquitectura modular de Angular** facilita el **mantenimiento** y la **escalabilidad**, con **componentes especializados** para cada funcionalidad médica simulada.

<img width="2378" height="1603" alt="Diagrama tecnologías " src="https://github.com/user-attachments/assets/214b0b26-7757-49f0-b73a-07ef91afe52b" />

**🖥 Explicación del Diagrama - Frontend**

Este diagrama muestra cómo las **diferentes tecnologías del frontend** se integran para crear la **interfaz de usuario final**.  
Cada tecnología contribuye a **aspectos específicos** que, combinados, forman una **aplicación cohesiva y funcional**.

## **🔧 Tecnologías Utilizadas - Backend**

El **backend** está construido sobre **Node.js** con **Express.js**, proporcionando una **API RESTful** eficiente y **escalable**.  

**Socket.io** maneja las **conexiones WebSocket** para **comunicación en tiempo real**, manteniendo **sesiones activas** y gestionando la **distribución de datos**.  

El sistema incluye **módulos especializados** para **validación de parámetros médicos**, **generación de reportes Excel** y **monitoreo de rendimiento**.  
La **arquitectura** está diseñada para soportar **múltiples sesiones simultáneas** con **gestión automática de recursos**, incluyendo **detección de desconexiones** y **recuperación ante fallos**.

<img width="3418" height="917" alt="Arquitectura_Del_Backend" src="https://github.com/user-attachments/assets/43517df9-df5c-4366-b623-439df3045136" />

**🗂 Explicación del Diagrama - Backend**

Ilustra la **arquitectura del backend**, mostrando cómo los **diferentes módulos** se integran alrededor del **servicio principal**.  
Cada módulo tiene **responsabilidades específicas** que contribuyen al **funcionamiento global del sistema**.

## **🔧 Tecnologías Utilizadas - Backend**

El **backend** está construido sobre **Node.js** con **Express.js**, proporcionando una **API RESTful** eficiente y **escalable**.  

**Socket.io** maneja las **conexiones WebSocket** para **comunicación en tiempo real**, manteniendo **sesiones activas** y gestionando la **distribución de datos**.  

El sistema incluye **módulos especializados** para **validación de parámetros médicos**, **generación de informes Excel** y **monitoreo de rendimiento**.  

La **arquitectura** está diseñada para soportar **múltiples sesiones simultáneas** con **gestión automática de recursos**, incluyendo **detección de desconexiones** y **recuperación ante fallos**.

<img width="606" height="421" alt="Estructura" src="https://github.com/user-attachments/assets/fb9bcc4a-31a5-41c3-898e-345f93b0c427" />

## **🚀 Proceso de Instalación y Configuración**

La **instalación del sistema** requiere **Node.js versión 16 o superior**, asegurando compatibilidad con todas las dependencias.  

El proceso comienza con la **clonación del repositorio**, seguido de la **instalación independiente de dependencias** tanto para **frontend** como **backend**.  

La **configuración** implica establecer **variables de entorno** para el **puerto del servidor** y **URLs de API**, con valores predeterminados para **desarrollo local**.  

El **script de inicio** automatiza la **verificación de puertos disponibles** y configura **reglas de firewall** en sistemas Windows, proporcionando una **experiencia de despliegue simplificada** incluso para **usuarios no técnicos**.

<img width="781" height="854" alt="Diagrama_De_Flujo" src="https://github.com/user-attachments/assets/dcccc888-65b7-4bfe-bc00-86bd2558de08" />

Este **diagrama de flujo** describe el **proceso completo de instalación y configuración**, desde la **clonación inicial** hasta el **servidor funcionando.**  
Muestra las **decisiones** y **alternativas** durante el **proceso de despliegue**.

<img width="426" height="1867" alt="deepseek_mermaid_20251007_91db04" src="https://github.com/user-attachments/assets/a756add9-3d3f-4fd1-840e-d729fe51c2cb" />

**🧭 Diagrama de Journey - Experiencia del Profesor**

Este **diagrama de journey** muestra la **experiencia completa del profesor**, dividida en **cuatro fases principales**.  
Cada fase incluye **interacciones específicas** entre el **usuario y el sistema**, con **indicación de la complejidad relativa** de cada paso.

## **🎓 Flujo de Uso para Estudiantes**

Los **estudiantes** acceden a la aplicación mediante **navegadores web estándar**, sin necesidad de instalación adicional.  
La pantalla inicial presenta un **campo para ingresar el código de sesión de 7 dígitos**, con **validación automática de formato**.  

Al conectar exitosamente, la interfaz muestra **cuatro paneles principales** con **parámetros médicos** que se **actualizan en tiempo real** según los datos enviados por el profesor.  
Los estudiantes pueden interactuar con ciertos **controles** como el **cronómetro** y los **ajustes de temperatura**, recibiendo **retroalimentación inmediata** de sus acciones.  
El **sistema de alarmas** se activa automáticamente cuando los valores simulados entran en **rangos críticos**, replicando **escenarios médicos realistas**.



## **🔧 Arquitectura de Comunicación en Tiempo Real**

La **comunicación en tiempo real** utiliza **WebSockets** mediante **Socket.io**, estableciendo **conexiones persistentes bidireccionales** entre clientes y servidor.  
El servidor mantiene un **registro de todas las sesiones activas** y sus participantes, utilizando **rooms de Socket.io** para agrupar estudiantes por sesión de profesor.  

El **protocolo** incluye mecanismos de **heartbeat** para detectar **conexiones caídas** y **reconexión automática** con **recuperación de estado**.  
Los **datos médicos** se validan tanto en el **cliente** como en el **servidor** antes de su procesamiento, asegurando **integridad en toda la cadena de comunicación**.



## **🛡️ Sistema de Seguridad y Validación**

El sistema implementa **múltiples capas de seguridad** que incluyen **validación de entrada** en **frontend** y **backend**, **autenticación de profesores** con contraseña y **gestión de sesiones** con **códigos únicos**.  

La **validación de datos médicos** verifica que todos los parámetros estén dentro de **rangos clínicamente realistas** antes de su procesamiento.  
El **bloqueo remoto** permite a los profesores **controlar el acceso estudiantil** durante las sesiones, mientras que el **sistema de logging** registra todas las actividades para **auditoría**.  
Las **conexiones** utilizan mecanismos de **timeout automático** y **limpieza de recursos** para prevenir **fugas de memoria**.



## **📊 Especificación de Parámetros Médicos**

Los **parámetros médicos simulados** están cuidadosamente calibrados para representar **rangos fisiológicamente realistas**:  

- **Temperatura de control:** 36.0°C a 40.0°C → representa fiebres clínicamente relevantes.  
- **Temperatura corporal:** 0°C a 60°C → permite simular hipotermia e hipertermia extremas.  
- **Saturación de oxígeno:** 85% a 100% → cubre desde hipoxia moderada hasta valores normales.  
- **Peso:** 400g a 4500g → diseñado para simulaciones neonatales.  

Cada parámetro incluye **validación de decimales** y **detección de valores críticos** que **activan alarmas automáticas**.



## **🤝 Proceso de Contribución al Proyecto**

El proyecto sigue un **modelo de desarrollo colaborativo** mediante **Git**, donde los contribuyentes realizan **fork** del repositorio principal y trabajan en **ramas feature** específicas.  

Cada cambio debe incluir **pruebas unitarias** y cumplir con los **estándares de código** establecidos.  
Las **pull requests** son revisadas mediante **code review**, verificando **funcionalidad**, **seguridad** y **rendimiento**.  

La **documentación** debe actualizarse junto con los cambios de código, manteniendo **consistencia** entre características implementadas y documentación.  
El proceso incluye **integración continua** que ejecuta **suites de prueba automáticas** antes del **merge**.



## **📝 Política de Licencias y Uso**

Este software es desarrollado y distribuido bajo **licencia propietaria de la institución universitaria**, reservando **todos los derechos**.  

Su uso está **autorizado exclusivamente para fines educativos** dentro de la institución, **prohibiéndose la distribución, modificación o uso comercial** sin autorización expresa.  
El **código fuente** se proporciona con fines de **transparencia educativa** y **desarrollo colaborativo interno**.  

Los contribuyentes deben **firmar acuerdos de transferencia de derechos intelectuales** antes de que sus contribuciones sean incorporadas al **código base principal**.



## **🆘 Sistema de Soporte Técnico**

El **soporte técnico** se estructura en **tres niveles**:  
1. **Documentación automática** para problemas comunes.  
2. **Asistencia entre pares** para la comunidad de desarrolladores.  
3. **Soporte especializado** para incidentes críticos.  

La documentación incluye **guías de instalación**, **solución de problemas** y **preguntas frecuentes (FAQ)**.  
Para **reportar issues**, los usuarios utilizan **plantillas estandarizadas** que capturan información del entorno y pasos para reproducir el problema.  

El **equipo de desarrollo** prioriza incidentes según su **severidad**, con **tiempos de respuesta definidos** para cada categoría de problema.
