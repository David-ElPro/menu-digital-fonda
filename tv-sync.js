// Respaldo de lectura para navegadores de TV antiguos. No permite escribir.
(function () {
  'use strict';
  var endpoint = 'https://firestore.googleapis.com/v1/projects/cocina-guerrero/databases/(default)/documents/menus/principal?key=AIzaSyBQ4xeR1OMt8zF9ECI8Fo6PC49mJvMBc4g';
  var timer = null, busy = false, failures = 0;
  var info = {connected:false, error:'', lastSuccess:0};
  function decode(value) {
    if (!value || typeof value !== 'object') throw new Error('Valor inválido');
    if ('nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return value.doubleValue;
    if ('stringValue' in value) return value.stringValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decode);
    if ('mapValue' in value) {
      var result = {}, fields = value.mapValue.fields || {};
      Object.keys(fields).forEach(function (key) {
        if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') result[key] = decode(fields[key]);
      });
      return result;
    }
    throw new Error('Formato de menú no reconocido');
  }
  function notify() {
    var node = document.getElementById('screenSyncStatus');
    if (!node) return;
    if (info.error) node.textContent = info.error;
    else if (info.connected) node.textContent = '';
  }
  function schedule(delay) {
    clearTimeout(timer);
    timer = setTimeout(check, delay);
  }
  function check() {
    if (busy) return;
    clearTimeout(timer);
    busy = true;
    var before = JSON.stringify(FondaMenu.load());
    var request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.timeout = 8000;
    var finished = false;
    function finish(error) {
      if (finished) return;
      finished = true; busy = false;
      if (error) {
        failures += 1; info.connected = false; info.error = error;
      } else {
        failures = 0; info.connected = true; info.error = ''; info.lastSuccess = Date.now();
      }
      notify();
      schedule(error ? Math.min(60000, 10000 * Math.pow(2, failures - 1)) : 10000);
    }
    request.onload = function () {
      if (request.status !== 200) {
        finish(request.status === 403 ? 'No se puede leer el menú compartido. Revisa las reglas de Firebase.' : request.status === 404 ? 'Esperando publicación del menú.' : 'Sin conexión • Mostrando el último menú disponible');
        return;
      }
      try {
        var response = JSON.parse(request.responseText);
        var state = FondaMenu.normalize(decode(response.fields.state));
        var current = JSON.stringify(FondaMenu.load());
        // A newer realtime update takes precedence over an in-flight request.
        if (current === before && JSON.stringify(state) !== current) {
          if (!FondaMenu.save(state)) throw new Error('No se pudo actualizar la copia local');
          var event = document.createEvent('Event');
          event.initEvent('fonda-menu-updated', false, false);
          window.dispatchEvent(event);
        }
        finish(null);
      } catch (error) { finish('No se pudo actualizar el menú • Reintentando'); }
    };
    request.onerror = request.ontimeout = request.onabort = function () {
      finish('Sin conexión • Mostrando el último menú disponible');
    };
    try { request.send(); } catch (error) { finish('Sin conexión • Mostrando el último menú disponible'); }
  }
  window.FondaTvSync = {info:info};
  window.addEventListener('online', check);
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  window.addEventListener('fonda-cloud-status', notify);
  schedule(1000);
})();
