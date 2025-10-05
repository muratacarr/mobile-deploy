import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={[
            styles.button,
            i18n.language === lang.code && styles.activeButton,
          ]}
          onPress={() => changeLanguage(lang.code)}
        >
          <Text style={styles.flag}>{lang.flag}</Text>
          <Text
            style={[
              styles.text,
              i18n.language === lang.code && styles.activeText,
            ]}
          >
            {lang.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#3b82f620',
    borderColor: '#3b82f6',
  },
  flag: {
    fontSize: 20,
  },
  text: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: '#3b82f6',
  },
});

