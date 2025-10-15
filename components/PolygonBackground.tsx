import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

interface PolygonBackgroundProps {
  color: string;
  variant?: 'style1' | 'style2' | 'style3';
}

export default function PolygonBackground({ color, variant = 'style1' }: PolygonBackgroundProps) {
  const getPolygons = () => {
    switch (variant) {
      case 'style1':
        return (
          <>
            <Polygon points="0,0 120,0 80,100" fill={color} opacity={0.15} />
            <Polygon points="120,0 200,40 150,120 80,100" fill={color} opacity={0.1} />
            <Polygon points="200,40 250,0 250,100 150,120" fill={color} opacity={0.08} />
            <Polygon points="0,100 80,100 60,180" fill={color} opacity={0.12} />
          </>
        );
      case 'style2':
        return (
          <>
            <Polygon points="0,50 100,0 150,80 50,120" fill={color} opacity={0.15} />
            <Polygon points="150,80 250,50 250,150 180,140" fill={color} opacity={0.1} />
            <Polygon points="50,120 180,140 120,200 0,180" fill={color} opacity={0.12} />
          </>
        );
      case 'style3':
        return (
          <>
            <Polygon points="250,0 200,80 250,120" fill={color} opacity={0.15} />
            <Polygon points="0,0 100,50 80,120 0,100" fill={color} opacity={0.1} />
            <Polygon points="100,50 200,80 180,150 80,120" fill={color} opacity={0.12} />
            <Polygon points="180,150 250,120 250,200 150,200" fill={color} opacity={0.08} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 250 200" preserveAspectRatio="xMidYMid slice">
        {getPolygons()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
});
