// screens/JobListScreen.js
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobListScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Check AsyncStorage first
        const storedJobs = await AsyncStorage.getItem('jobs');
        if (storedJobs) {
          console.log('Loaded from AsyncStorage:', storedJobs);
          setJobs(JSON.parse(storedJobs));
        }

        // Fetch from server
        const url = 'http://192.168.0.108:3000/api/jobs';
        console.log('Fetching from:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        setJobs(data);

        // Store in AsyncStorage
        await AsyncStorage.setItem('jobs', JSON.stringify(data));
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError(err.message);
        const storedJobs = await AsyncStorage.getItem('jobs');
        if (storedJobs) {
          setJobs(JSON.parse(storedJobs));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading jobs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.jobItem}
            onPress={() => navigation.navigate('JobDetails', { job: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.company}</Text>
            <Text>{item.location}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No jobs available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  jobItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
  title: { fontSize: 16, fontWeight: 'bold' },
});