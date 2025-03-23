// screens/JobDetailsScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function JobDetailsScreen({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.subtitle}>{job.company}</Text>
      <Text style={styles.subtitle}>{job.location}</Text>
      <Text style={styles.section}>Description:</Text>
      <Text style={styles.text}>{job.description}</Text>
      <Text style={styles.section}>Requirements:</Text>
      <Text style={styles.text}>{job.requirements}</Text>
      <Button
        title="Apply Now"
        onPress={() => alert('Application logic to be implemented')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});