import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppointmentCreatedScreen from '../screens/AppointmentCreatedScreen';
import AppointmentDetailScreen from '../screens/AppointmentDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import ReviewAppointmentScreen from '../screens/ReviewAppointmentScreen';
import SelectDateTimeScreen from '../screens/SelectDateTimeScreen';
import SelectProfessionalScreen from '../screens/SelectProfessionalScreen';
import SelectSpecialtyScreen from '../screens/SelectSpecialtyScreen';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="SelectSpecialty"
          component={SelectSpecialtyScreen}
          options={{ title: 'Especialidade' }}
        />
        <Stack.Screen
          name="SelectProfessional"
          component={SelectProfessionalScreen}
          options={{ title: 'Profissional' }}
        />
        <Stack.Screen
          name="SelectDateTime"
          component={SelectDateTimeScreen}
          options={{ title: 'Data e horário' }}
        />
        <Stack.Screen
          name="ReviewAppointment"
          component={ReviewAppointmentScreen}
          options={{ title: 'Revisão' }}
        />
        <Stack.Screen
          name="AppointmentCreated"
          component={AppointmentCreatedScreen}
          options={{ title: 'Agendamento', headerBackVisible: false }}
        />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
        <Stack.Screen
          name="AppointmentDetail"
          component={AppointmentDetailScreen}
          options={{ title: 'Detalhes da consulta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
