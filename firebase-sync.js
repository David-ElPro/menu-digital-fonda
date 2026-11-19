// Configuración web pública de cocina-guerrero; las reglas protegen las escrituras.
(function () {
  const ADMIN_UIDS = ['cI41h5DZGURJgjNAkhBK5SEfLL33', 'tNm9qnzrcicgyc4Oj6rmcdlAIE83', 'uII1zdgYFjVldt9z6CmgOr6V8El2'];
  const info = { ready: false, connected: false, user: null, authorized: false, saving: false, error: '', empty: false };
  let sdk, auth, db, menuRef;
  const announce = () => window.dispatchEvent(new CustomEvent('fonda-cloud-status', {detail: {...info}}));
  const accept = state => {
    FondaMenu.save(state);
    window.dispatchEvent(new Event('fonda-menu-updated'));
  };
  const errorText = error => {
    const code = error.code || '';
    if (code === 'app/version-mismatch') return 'Hay archivos de una versión anterior. Recarga esta página para actualizar el panel.';
    if (code.includes('permission-denied')) return 'Firebase rechazó el acceso. Publica las reglas de Firestore del proyecto.';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Correo o contraseña incorrectos.';
    if (code.includes('operation-not-allowed')) return 'Activa Correo electrónico/contraseña en Firebase Authentication.';
    if (code.includes('too-many-requests')) return 'Demasiados intentos. Espera un momento antes de volver a entrar.';
    if (code.includes('network') || code.includes('unavailable')) return 'Sin conexión con Firebase. Revisa internet y vuelve a intentar.';
    return 'No se pudo conectar con Firebase. Revisa la configuración e inténtalo otra vez.';
  };
  async function start() {
    try {
      if (typeof FondaMenu.normalize !== 'function') {
        const error = new Error('Versión de catálogo incompatible');
        error.code = 'app/version-mismatch';
        throw error;
      }
      const [appSdk, authSdk, firestoreSdk] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js')
      ]);
      sdk = {...authSdk, ...firestoreSdk};
      const app = appSdk.initializeApp({
        apiKey: 'AIzaSyBQ4xeR1OMt8zF9ECI8Fo6PC49mJvMBc4g',
        authDomain: 'cocina-guerrero.firebaseapp.com', projectId: 'cocina-guerrero',
        messagingSenderId: '202694525150', storageBucket: 'cocina-guerrero.firebasestorage.app'
      });
      auth = sdk.getAuth(app);
      db = sdk.getFirestore(app);
      menuRef = sdk.doc(db, 'menus', 'principal');
      sdk.onAuthStateChanged(auth, user => {
        info.user = user ? {uid:user.uid, email:user.email} : null;
        info.authorized = !!user && ADMIN_UIDS.includes(user.uid);
        announce();
      });
      sdk.onSnapshot(menuRef, {includeMetadataChanges:true}, snapshot => {
        // Never announce speculative local writes as a published menu.
        if (snapshot.metadata.hasPendingWrites) return;
        try {
          info.connected = !snapshot.metadata.fromCache;
          if (snapshot.exists()) accept(FondaMenu.normalize(snapshot.data().state));
          info.empty = !snapshot.exists();
          info.ready = !snapshot.metadata.fromCache;
          info.error = '';
        } catch (error) {
          info.ready = false; info.error = 'El menú compartido tiene un formato inválido.';
        }
        announce();
      }, error => {
        info.ready = false; info.connected = false; info.error = errorText(error); announce();
      });
    } catch (error) {
      info.error = errorText(error); announce();
    }
  }
  async function login(email, password) {
    if (!auth) throw new Error('Firebase todavía no está disponible. Revisa internet y recarga.');
    try { await sdk.signInWithEmailAndPassword(auth, email, password); }
    catch (error) { throw new Error(errorText(error)); }
  }
  async function publish(changes, initial) {
    if (!info.authorized) throw new Error('Inicia sesión con una de las dos cuentas autorizadas.');
    if (!info.ready || !info.connected || !navigator.onLine) throw new Error('No hay conexión con Firebase. Los cambios siguen pendientes.');
    if (info.saving) throw new Error('Ya se están guardando los cambios.');
    info.saving = true; announce();
    try {
      const result = await sdk.runTransaction(db, async transaction => {
        const snapshot = await transaction.get(menuRef);
        const state = FondaMenu.normalize(snapshot.exists() ? snapshot.data().state : initial);
        for (const change of changes) {
          if (!['dishes','soups','waters','desserts'].includes(change.key) || !['active','selectedVariant','price','takeoutPrice'].includes(change.field)) throw new Error('Cambio inválido.');
          const item = state[change.key].find(item => item.id === change.id);
          if (!item) throw new Error('Un platillo cambió. Recarga el panel.');
          if (change.field === 'active' && typeof change.value !== 'boolean') throw new Error('Disponibilidad inválida.');
          if (change.field === 'selectedVariant' && !(item.variants || []).some(v=>v.label === change.value)) throw new Error('Variante inválida.');
          if (change.field === 'price' || change.field === 'takeoutPrice') {
            if (!(change.field === 'takeoutPrice' && change.value === null) && (!Number.isFinite(change.value) || change.value < 0 || change.value > 99999 || Math.abs(change.value * 100 - Math.round(change.value * 100)) > .00001)) throw new Error('Precio inválido.');
          }
          item[change.field] = change.value;
        }
        if (state.soups.filter(x=>x.active).length > 3 || state.waters.filter(x=>x.active).length > 2) throw new Error('Selecciona máximo 3 sopas y 2 aguas.');
        transaction.set(menuRef, {state, updatedAt:sdk.serverTimestamp(), updatedBy:auth.currentUser.uid});
        return state;
      });
      accept(result);
      return result;
    } catch (error) {
      if (error.code) throw new Error(errorText(error));
      throw error;
    } finally { info.saving = false; announce(); }
  }
  window.FondaCloud = {info, login, logout:()=>sdk.signOut(auth), publish};
  window.addEventListener('offline', () => {info.connected=false; announce();});
  window.addEventListener('online', announce);
  start();
})();
