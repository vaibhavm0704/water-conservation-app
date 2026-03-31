import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';
import { CustomButton } from '../../components/CustomButton';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>Good Morning, Admin!</Text>
        <Text style={styles.subtitle}>Your setup is 80% complete.</Text>
      </View>

      <View style={styles.actionContainer}>
        <CustomButton 
          title="Add New Address" 
          onPress={() => {}} 
          type="primary" 
        />
        <CustomButton 
          title="Manage Residents" 
          onPress={() => {}} 
          type="outline" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.primaryLight,
  },
  actionContainer: {
    padding: 16,
  }
});
