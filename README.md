# **Proyecto de Simulación Médica - Cuna Radiante**

## 📋 **Descripción del Proyecto**  
<p>
 Este sistema de simulación médica representa una plataforma educativa avanzada desarrollada específicamente para la Universidad. Facilita el aprendizaje práctico en entornos médicos simulados mediante una arquitectura cliente-servidor robusta que permite la interacción en tiempo real entre profesores y estudiantes. La aplicación simula parámetros fisiológicos críticos como temperatura corporal, saturación de oxígeno y peso, proporcionando una experiencia educativa inmersiva y controlada. Soporta múltiples grupos de trabajo simultáneos, generación de reportes automatizados y un sistema de alarmas para valores críticos, haciendo de esta herramienta un recurso invaluable para la formación médica moderna. 
</p>

<p align="center">
  <img width="598" height="614" alt="Arquitectura" src="https://github.com/user-attachments/assets/4de967a8-b016-43f3-95f2-153eab2b42ca" />
</p>

<p>
  Este diagrama muestra la arquitectura cliente-servidor donde tanto profesores como estudiantes acceden a través de interfaces web construidas con Ionic/Angular. El backend en Node.js gestiona las conexiones mediante
WebSockets, almacena datos temporalmente en memoria y genera reportes. La comunicación bidireccional permite actualizaciones en tiempo real.
</p>

<p>
  <img width="1909" height="828" alt="Home" src="https://github.com/user-attachments/assets/458a3989-02a1-4041-a382-0173bf385eb1" />
</p>

## **🎯 Características Principales - Módulo Profesor**

<p>
  El módulo del profesor ofrece un panel de control completo para la gestión educativa, permitiendo crear sesiones personalizadas con códigos de acceso únicos de 7 dígitos. Los educadores pueden enviar parámetros médicos específicos a grupos individuales o de manera masiva, seleccionando entre tres modos de operación especializados. El sistema incluye funcionalidades avanzadas como generación de valores aleatorios para prácticas, bloqueo remoto de interfaces estudiantiles y generación de reportes detallados en formato Excel. La interfaz proporciona monitoreo en tiempo real del estado de conexión de todos los grupos, facilitando la gestión del aula virtual.
</p>

<p>
  <img width="941" height="761" alt="Diagrama_de_Secuencia" src="https://github.com/user-attachments/assets/facb263e-5c12-4593-b0b6-928408fb3530" />
</p>

<p>
  Este diagrama de secuencia ilustra el flujo de interacción entre profesor, servidor y estudiante. Comienza con la activación de la sesión, sigue con el envío de parámetros médicos y finaliza con la generación de reportes, mostrando la comunicación sincronizada entre todos los componentes.
</p>

<p>
  <img width="1911" height="903" alt="Vista_Profesor_Con_Dos_Conexiones" src="https://github.com/user-attachments/assets/f1b93123-acdc-4c0c-be1f-eea951f48425" />
</p>

## **🎓 Características Principales - Módulo Estudiante**

<p>
  La interfaz estudiantil está diseñada específicamente para el aprendizaje práctico, presentando una simulación realista de controles médicos con retroalimentación visual inmediata. Los estudiantes ingresan mediante códigos de sesión proporcionados por el profesor, accediendo a una pantalla con cuatro parámetros médicos principales y un cronómetro integrado. El sistema incluye mecanismos de validación de rangos médicos realistas y activa alarmas sonoras y visuales cuando los valores entran en zonas críticas. La interfaz responde dinámicamente a los cambios enviados por el profesor, permitiendo a los estudiantes practicar la interpretación de signos vitales en un entorno seguro y controlado.
</p>

<p>
  <img width="1280" height="305" alt="Diagrama_de_Estados" src="https://github.com/user-attachments/assets/a2faaba2-fb99-4ee0-906b-771c7da5fece" />
</p>

<p>
  Este diagrama de estados muestra el ciclo de vida de la conexión estudiantil, desde la desconexión inicial hasta la recepción de datos, validación y posibles estados de alarma. Ilustra cómo el sistema maneja diferentes escenarios durante la simulación.
</p>

<p>
  <img width="1325" height="599" alt="Vista01_Estudiante_Con_Datos_Enviados" src="https://github.com/user-attachments/assets/d128517c-509b-449b-83f1-7a2c5216eb4a" />
</p>

## **🔄 Diferencia entre Estudiantes con y sin Saturación de Oxígeno**

<p>
  El proyecto incluye dos variantes de interfaz para estudiantes: una completa (estudiante.page) y otra simplificada (estudiante-sso.page). La versión completa muestra cuatro parámetros médicos: control de temperatura, peso, temperatura corporal y saturación de oxígeno. La versión simplificada (SSO) omite la saturación de oxígeno y se centra en los tres parámetros restantes, además de presentar una disposición diferente de los elementos. Esta versión está diseñada para simulaciones donde el monitoreo de oxígeno no es requerido, optimizando el espacio y la complejidad de la interfaz. Actualmente la versión SSO se encuentra en desarrollo y falta completar algunas funcionalidades.
</p>
<p>
  <img width="1420" height="593" alt="Vista_De_Estudiantes_Sin_Saturacion_Vista_Incompleta" src="https://github.com/user-attachments/assets/23d37be2-0039-4b84-a148-78d3ac4b53ae" />
</p>

## **🔧Tecnologías Utilizadas - Frontend**

<p>
  El frontend está desarrollado utilizando Ionic Framework combinado con Angular, proporcionando una aplicación web progresiva (PWA) altamente responsive y multiplataforma. TypeScript asegura un código mantenible y robusto, mientras que SCSS permite un diseño visual coherente y adaptable a diferentes dispositivos. Socket.io Client gestiona la comunicación bidireccional con el servidor, asegurando actualizaciones en tiempo real sin necesidad de recargas. La arquitectura modular de Angular facilita el mantenimiento y escalabilidad, con componentes especializados para cada funcionalidad médica simulada.
</p>
<p align="center">
  <img width="854" height="799" alt="Diagrama_Tecnologías" src="https://github.com/user-attachments/assets/0f859f4d-9b9a-447a-b951-fdf9d283b351" />
</p>
<p>
  Este diagrama muestra cómo las diferentes tecnologías del frontend se integran para crear la interfaz de usuario final. Cada tecnología contribuye a aspectos específicos que combinados forman una aplicación cohesiva y funcional.
</p>

## **🔧 Tecnologías Utilizadas - Backend**
<p>
  El backend está construido sobre Node.js con Express.js, proporcionando una API RESTful eficiente y escalable. Socket.io maneja las conexiones WebSocket para comunicación en tiempo real, manteniendo sesiones activas y gestionando la distribución de datos. El sistema incluye módulos especializados para validación de parámetros médicos, generación de reportes Excel y monitoreo de rendimiento. La arquitectura está diseñada para soportar múltiples sesiones simultáneas con gestión automática de recursos, incluyendo detección de desconexiones y recuperación ante fallos.
</p>
<p align="center">
  <img width="571" height="575" alt="image" src="https://github.com/user-attachments/assets/97eddb47-1a43-42a3-8c12-6ff7460a2340" />

</p>
<p>
  Ilustra la arquitectura del backend mostrando cómo los diferentes módulos se integran alrededor del servicio principal. Cada módulo tiene responsabilidades específicas que contribuyen al funcionamiento global del sistema.
</p>

## **📁 Estructura Detallada del Proyecto**

<p>
  La estructura del proyecto sigue las mejores prácticas de desarrollo, separando claramente el frontend del backend. El frontend organiza los componentes por funcionalidad (home, profesor, estudiante) con módulos independientes para cada vista. El backend utiliza una arquitectura por capas con gestores especializados para sockets, variables médicas y monitoreo. Los assets incluyen recursos multimedia como imágenes de interfaz y sonidos de alarma. La configuración de entorno permite despliegues flexibles en diferentes entornos, mientras que los scripts de construcción optimizan la aplicación para producción.
</p>
<p align="center">
  <img width="807" height="745" alt="image" src="https://github.com/user-attachments/assets/0e5e15e3-f759-4e60-b7df-2d675a87074e" />
</p>

## **🚀 Proceso de Instalación y Configuración**

<p>
  La instalación del sistema requiere Node.js versión 16 o superior, asegurando compatibilidad con todas las dependencias. El proceso comienza con la clonación del repositorio, seguido de la instalación independiente de dependencias tanto para frontend como backend. La configuración implica establecer variables de entorno para el puerto del servidor y URLs de API, con valores predeterminados para desarrollo local. El script de inicio automatiza la verificación de puertos disponibles y configura reglas de firewall en sistemas Windows, proporcionando una experiencia de despliegue simplificada incluso para usuarios no técnicos.
</p>
<p align="center">
  <img width="920" height="201" alt="image" src="https://github.com/user-attachments/assets/b53b7cde-40a1-4729-931c-9157585b3d49" />
</p>
<p>
  Este diagrama de flujo describe el proceso completo de instalación y configuración en 8 pasos secuenciales. Desde la clonación inicial hasta el acceso final a la aplicación, mostrando las decisiones críticas durante el proceso de despliegue.
</p>

## **💻 Flujo de Uso para Profesores**

<p>
  Los profesores inician sesión mediante un sistema de autenticación que valida credenciales antes de acceder al panel de control. Una vez autenticados, activan una nueva sesión educativa que genera un código único de 7 dígitos, compartible con los estudiantes. La interfaz principal muestra una tabla de grupos conectados con controles individuales para enviar parámetros médicos específicos. Los profesores pueden seleccionar entre modos preconfigurados o ingresar valores manuales, con validación en tiempo real que previene entradas médicamente incorrectas. El sistema permite enviar datos a grupos individuales o masivamente, con confirmación visual del estado de entrega.
</p>
<p align="center">
  <img width="921" height="178" alt="image" src="https://github.com/user-attachments/assets/7e3e1c92-8a7d-40b9-b026-06700d4b26a5" />
</p>
<p>
  Este diagrama de journey muestra la experiencia completa del profesor a través de cuatro fases principales. Comienza con la autenticación donde se validan las credenciales de acceso, continúa con la gestión de sesión donde se activa la conexión y genera el código para estudiantes. Luego en el envío de datos se configuran y validan los parámetros médicos antes de distribuirlos a los grupos. Finaliza con reportes y análisis donde se generan documentos Excel con los resultados de la sesión. Cada interacción muestra la colaboración entre el profesor y el sistema.
</p>
<p align="center">
  <img width="1891" height="901" alt="Vista_Profesor_Sin_Conexciones" src="https://github.com/user-attachments/assets/de692dc7-f899-4d11-8aba-2309f52245ef" />
</p>

## **🎓 Flujo de Uso para Estudiantes**

<p>
  Los estudiantes acceden a la aplicación mediante navegadores web estándar sin necesidad de instalación adicional. La pantalla inicial presenta un campo para ingresar el código de sesión de 7 dígitos, con validación automática de formato. Al conectar exitosamente, la interfaz muestra los parámetros médicos que se actualizan en tiempo real según los datos enviados por el profesor. Los estudiantes pueden interactuar con controles específicos y recibir retroalimentación inmediata de sus acciones.
</p>
<p align="center">
  <img width="390" height="950" alt="image" src="https://github.com/user-attachments/assets/76ff1d4e-a903-4305-8e71-e308c346d38f" />
</p>
<p>
  Este diagrama de flujo detalla el proceso completo del estudiante desde el inicio hasta la desconexión. Comienza con el ingreso del código de sesión, sigue con la conexión al servidor y la recepción de parámetros médicos en tiempo real. El estudiante puede interactuar con controles específicos como ajuste de temperatura, cronómetro y alarmas. El ciclo se mantiene mientras la sesión esté activa, actualizando constantemente los valores recibidos del profesor.
</p>
<p align="center">
  <img width="1345" height="609" alt="Vista02_Estudiante_Con_Datos_Enviados" src="https://github.com/user-attachments/assets/6377f0dd-4789-4dd7-9a83-0a85a880b1d7" />
</p>


## **🔧 Arquitectura de Comunicación en Tiempo Real**

<p>
  La comunicación en tiempo real utiliza WebSockets mediante Socket.io, estableciendo conexiones persistentes bidireccionales entre clientes y servidor. El servidor mantiene un registro de todas las sesiones activas y sus participantes, utilizando rooms de Socket.io para agrupar estudiantes por sesión de profesor. El protocolo incluye mecanismos de heartbeat para detectar conexiones caídas y reconexión automática con recuperación de estado. Los datos médicos se validan tanto en el cliente como en el servidor antes de su procesamiento, asegurando integridad en toda la cadena de comunicación.
</p>

## **🛡️ Sistema de Seguridad y Validación**

<p>
  El sistema implementa múltiples capas de seguridad que incluyen validación de entrada en frontend y backend, autenticación de profesores con contraseña y gestión de sesiones con códigos únicos. La validación de datos médicos verifica que todos los parámetros estén dentro de rangos clínicamente realistas antes de su procesamiento. El bloqueo remoto permite a los profesores controlar el acceso estudiantil durante las sesiones, mientras que el sistema de logging registra todas las actividades para auditoría. Las conexiones utilizan mecanismos de timeout automático y limpieza de recursos para prevenir fugas de memoria.
</p>

## **📊 Especificación de Parámetros Médicos**

<p>
  Los parámetros médicos simulados están cuidadosamente calibrados para representar rangos fisiológicamente realistas. La temperatura de control oscila entre 36.0°C y 40.0°C, representando fiebres clínicamente relevantes. La temperatura corporal abarca desde 0°C hasta 60°C, permitiendo simular hipotermia e hipertermia extremas. La saturación de oxígeno varía entre 85% y 100%, cubriendo desde hipoxia moderada hasta valores normales. El peso se define entre 400g y 4500g, específicamente diseñado para simulaciones neonatales. Cada parámetro incluye validación de decimales y detección de valores críticos que activan alarmas.
</p>
<p align="center">
  <img width="387" height="385" alt="Vista_Del_Reporte_Excel_Descargado_Con_Dos_Estudiantes" src="https://github.com/user-attachments/assets/895e0336-2307-44c1-9d6d-89cc837acc2d" />
</p>

## **🤝 Proceso de Contribución al Proyecto**

<p>
  El proyecto sigue un modelo de desarrollo colaborativo mediante Git, donde los contribuyentes realizan fork del repositorio principal y trabajan en ramas feature específicas. Cada cambio debe incluir pruebas unitarias y cumplir con los estándares de código establecidos. Las solicitudes de pull request son revisadas mediante code review que verifica funcionalidad, seguridad y rendimiento. La documentación debe actualizarse paralelamente a los cambios de código, manteniendo consistencia entre características implementadas y su documentación. El proceso incluye integración continua que ejecuta suites de prueba automáticas antes de la merge.
</p>

## **📝 Política de Licencias y Uso**

<p>
  Este software es desarrollado y distribuido bajo licencia propietaria de la Universidad, reservando todos los derechos. Su uso está autorizado exclusivamente para fines educativos dentro de la institución, prohibiéndose la distribución, modificación o uso comercial sin autorización expresa. El código fuente se proporciona con fines de transparencia educativa y desarrollo colaborativo interno. Los contribuyentes deben firmar acuerdos de transferencia de derechos intelectuales antes de que sus contribuciones sean incorporadas al código base principal.
</p>

## **🆘 Sistema de Soporte Técnico**

<p>
  El soporte técnico se estructura en tres niveles: documentación automática para problemas comunes, asistencia entre pares para la comunidad de desarrolladores y soporte especializado para incidentes críticos. La documentación incluye guías de instalación, solución de problemas y preguntas frecuentes. Para reportar issues, los usuarios utilizan plantillas estandarizadas que capturan información esencial del entorno y pasos para reproducir problemas. El equipo de desarrollo prioriza incidentes según severidad, con tiempos de respuesta definidos para cada categoría de problema.
</p>



















