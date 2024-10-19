import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometrics = async () => {
  try {
    const {biometryType} = await rnBiometrics.isSensorAvailable();
    return biometryType;
  } catch (error) {
    return null;
  }
};

export const generateBiometricPublicKey = async () => {
  try {
    const {keysExist} = await rnBiometrics.biometricKeysExist();
    if (keysExist) {
      throw new Error('Biometric Key exists.');
    }
    const {publicKey} = await rnBiometrics.createKeys();
    console.log(publicKey, 'Send this to server');
  } catch (error) {
    console.log(error);
  }
};

export const deleteBiometricKey = async () => {
  try {
    const {keysDeleted} = await rnBiometrics.deleteKeys();
    if (!keysDeleted) {
      throw new Error('Can age biometrics');
    }
    console.log(keysDeleted);
    // remove from backend
  } catch (error) {
    console.log(error);
  }
};

export const loginWithBiometrics = async (userID: string) => {
  try {
    const isBiometricAvailable = await checkBiometrics();
    if (!isBiometricAvailable) {
      throw new Error('Biometric not available');
    }

    const {keysExist} = await rnBiometrics.biometricKeysExist();
    if (!keysExist) {
      const {publicKey} = await rnBiometrics.createKeys();
      console.log('PublicKey', publicKey);
    }

    const {success, signature} = await rnBiometrics.createSignature({
      promptMessage: 'Sign In',
      payload: userID,
    });

    if (!success) {
      throw new Error('Biometrics authentication failed!');
    }

    console.log(signature);
    if (signature) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log('Error', JSON.stringify(error));
    return false;
  }
};
