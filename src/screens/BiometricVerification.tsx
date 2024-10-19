import React, {FC, useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {LOGO} from '../assets';
import CustomNumberPad from '../components/CustomNumberPad';
import CustomSafeAreaView from '../components/CustomSafeAreaView';
import CustomText from '../components/CustomText';
import RoundOTPInput from '../components/RoundOTPInput';
import TouchableText from '../components/TouchableText';
import {FONTS} from '../constans/Fonts';
import {loginWithBiometrics} from '../utils/BiometricUtils';
import {resetAndNavigate} from '../utils/NavigationUtil';

const initialState = ['', '', '', ''];

interface BiometricProp {
  onForgotPin: () => void;
}

const BiometricVerification: FC<BiometricProp> = ({onForgotPin}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handlePressNumber = (number: number | string) => {
    if (focusedIndex < otpValues.length) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex] = number.toString();
      setOtpError(null);
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex + 1);
    }
  };

  const handlePressBackspace = () => {
    if (focusedIndex > 0) {
      const newOtpValues = [...otpValues];
      newOtpValues[focusedIndex - 1] = '';
      setOtpValues(newOtpValues);
      setFocusedIndex(focusedIndex - 1);
    }
  };

  // const handleBiometricVerification = async () => {
  //   const { msg, result } = await dispatch(
  //     loginWithBiometrics(user.userId || "")
  //   );
  //   if (!result) {
  //     setOtpError(msg);
  //     return;
  //   }

  //   if (result) {
  //     setOtpValues(["B", "I", "O", "P"]);
  //     resetAndNavigate("BottomTab");
  //   }
  // };

  const handleBiometricVerification = async () => {
    const isVerify = await loginWithBiometrics('123123');
    console.log('response verify:', isVerify);
    if (isVerify) {
      setOtpValues(['B', 'I', 'O', 'P']);
    }
  };

  const handlePressChecknark = async () => {
    let valid = false;
    otpValues.forEach(i => {
      if (i === '') {
        valid = true;
        setOtpError('Wrong PIN. 2 attempt remaining.');
        setOtpValues(initialState);
        setFocusedIndex(0);
      }
    });
    if (!valid) {
      setLoading(true);
      await setTimeout(() => {
        setLoading(false);
        setOtpValues(initialState);
        setFocusedIndex(0);
        resetAndNavigate('Home');
      }, 2000);
    }
  };

  // const handlePressCheckmark = async () => {
  //   let valid = false;
  //   if (otpValues.join("") == "BIOP") {
  //     return;
  //   }
  //   otpValues.forEach((i) => {
  //     if (i === "") {
  //       valid = true;
  //       setOtpError("Enter PIN");
  //       setOtpValues(initialState);
  //       setFocusedIndex(0);
  //     }
  //   });
  //   if (!valid) {
  //     setLoading(true);
  //     const { result, msg } = await dispatch(
  //       VerifyPin({ login_pin: otpValues.join("") }, updateAccessToken)
  //     );
  //     if (!result) {
  //       setOtpError(msg);
  //     } else {
  //       resetAndNavigate("BottomTab");
  //     }
  //     setOtpValues(initialState);
  //     setFocusedIndex(0);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const allFilled = otpValues.every(value => value !== '');
    if (allFilled) {
      handlePressChecknark();
    }
  }, [otpValues]);

  useEffect(() => {
    handleBiometricVerification();
  }, []);

  return (
    <CustomSafeAreaView>
      <View style={styles.container}>
        <Image source={LOGO} style={styles.logo} />
        <CustomText variant="h6" fontFamily={FONTS.Bold}>
          Enter Groww PIN
        </CustomText>
        <View style={styles.emailContainer}>
          {/* <CustomText style={styles.subText}>{user?.email}</CustomText> */}
          <CustomText style={styles.subText}>ra*****3@gmail.com</CustomText>
          <TouchableText firstText="Logout" style={styles.logoutText} />
        </View>
      </View>

      <RoundOTPInput
        onForgotPin={onForgotPin}
        loading={loading}
        otpValues={otpValues}
        error={otpError}
      />

      <CustomNumberPad
        customFont
        onPressBiometric={handleBiometricVerification}
        isBiometric={true}
        onPressNumber={handlePressNumber}
        onPressBackspace={handlePressBackspace}
        onPressCheckmark={handlePressChecknark}
      />
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: RFValue(25),
    marginBottom: RFValue(10),
  },
  logo: {
    height: RFValue(25),
    width: RFValue(25),
    alignSelf: 'center',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 15,
  },
  subText: {
    fontSize: RFValue(10),
  },
  logoutText: {
    fontFamily: FONTS.Regular,
    fontSize: RFValue(10),
  },
});

export default BiometricVerification;
