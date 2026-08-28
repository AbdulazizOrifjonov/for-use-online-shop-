import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Icon } from '../components/Icon';
import { COLORS } from '../theme/colors';
import { useStore } from '../context/StoreContext';

export function ProfileScreen() {
  const { user, login, logout } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Xato', "Email va parolni kiriting");
      return;
    }
    const success = login(email, password);
    if (!success) {
      Alert.alert('Xato', "Noto'g'ri email yoki parol. Admin uchun: admin@protools.uz / admin123");
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shaxsiy Kabinet</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Icon name="user" size={40} color={COLORS.rose} />
          </View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.roleBadge}>
            <Icon name={user.role === 'ADMIN' ? 'shield' : 'user'} size={14} color={COLORS.rose} />
            <Text style={styles.roleText}>
              {user.role === 'ADMIN' ? 'TIZIM ADMINI' : 'MIJOZ (CUSTOMER)'}
            </Text>
          </View>

          {user.role === 'ADMIN' && (
            <View style={styles.adminPanelBtn}>
              <Icon name="settings" size={16} color={COLORS.white} style={{marginRight: 6}} />
              <Text style={styles.adminPanelText}>Admin Panelga o'tish (Web)</Text>
            </View>
          )}

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Icon name="log-out" size={16} color={COLORS.white} style={{marginRight: 6}} />
            <Text style={styles.logoutText}>Tizimdan chiqish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.loginForm}>
        <Text style={styles.title}>Kirish</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email yoki Foydalanuvchi nomi</Text>
          <View style={styles.inputWrapper}>
            <Icon name="mail" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parol</Text>
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={18} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Parolni kiriting"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.forgotRow}>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Parolni unutdingizmi?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.loginBtnText}>Tizimga kirish</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>YOKI</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.telegramBtn} activeOpacity={0.85}>
          <Icon name="message-circle" size={18} color="#0088cc" style={{marginRight: 8}} />
          <Text style={styles.telegramBtnText}>Telegram orqali kirish</Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.noAccountText}>Akkauntingiz yo'qmi? </Text>
          <TouchableOpacity>
            <Text style={styles.registerText}>Ro'yxatdan o'tish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(253, 242, 248, 1)',
    borderWidth: 2,
    borderColor: '#F9A8D4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 242, 248, 1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    marginBottom: 24,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.rose,
    marginLeft: 6,
  },
  adminPanelBtn: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  adminPanelText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  loginForm: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#111827',
  },
  forgotRow: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.rose,
  },
  loginBtn: {
    backgroundColor: '#111827',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#6B7280',
  },
  telegramBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 136, 204, 0.4)',
    backgroundColor: 'rgba(0, 136, 204, 0.08)',
    height: 44,
    borderRadius: 8,
    marginBottom: 24,
  },
  telegramBtnText: {
    color: '#0088cc',
    fontSize: 14,
    fontWeight: '500',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  noAccountText: {
    fontSize: 14,
    color: '#6B7280',
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.rose,
  },
});
