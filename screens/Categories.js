import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { categories } from '../data';
import Category from '../components/Category';
import { ScrollView } from 'react-native-virtualized-view';

const Categories = () => {

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: COLORS.white }]}>
        <Header title="More Category" />
        <ScrollView style={styles.scrollView}>
          <FlatList
            data={categories.slice(1, categories.length)}
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            numColumns={4} // Render two items per row
            renderItem={({ item, index }) => (
              <Category
                name={item.name}
                icon={item.icon}
                iconColor={item.iconColor}
                backgroundColor={item.backgroundColor}
              />
            )}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  scrollView: {
    marginVertical: 22
  }
})

export default Categories