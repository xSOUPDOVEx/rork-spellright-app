import Button from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, Crown, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Plan = 'monthly' | 'yearly';

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('yearly');
  const { updateSettings } = useApp();
  const router = useRouter();

  const features = {
    free: [
      { text: '5 words per day', included: true },
      { text: 'Basic difficulty levels', included: true },
      { text: 'Progress tracking', included: true },
      { text: 'Unlimited practice', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Personalized learning', included: false },
      { text: 'Offline mode', included: false },
    ],
    premium: [
      { text: 'Unlimited practice', included: true },
      { text: 'All difficulty levels', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Personalized learning paths', included: true },
      { text: 'Offline mode', included: true },
      { text: 'Priority support', included: true },
      { text: 'Ad-free experience', included: true },
    ],
  };

  const handleSubscribe = () => {
    updateSettings({ isPremium: true });
    router.back();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradient.primary[0], Colors.gradient.primary[1]]}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={Colors.white} />
          </TouchableOpacity>
          <Crown size={48} color={Colors.white} />
          <Text style={styles.headerTitle}>Go Premium</Text>
          <Text style={styles.headerSubtitle}>
            Unlock your full learning potential
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.plansContainer}>
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}
            onPress={() => setSelectedPlan('monthly')}
            testID="monthly-plan"
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Monthly</Text>
              {selectedPlan === 'monthly' && (
                <View style={styles.selectedBadge}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>$9.99/month</Text>
            <Text style={styles.planDescription}>Billed monthly</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardActive]}
            onPress={() => setSelectedPlan('yearly')}
            testID="yearly-plan"
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>BEST VALUE</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Yearly</Text>
              {selectedPlan === 'yearly' && (
                <View style={styles.selectedBadge}>
                  <Check size={16} color={Colors.white} />
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>$79.99/year</Text>
            <Text style={styles.planDescription}>Save 33% • $6.67/month</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Compare Plans</Text>

          <View style={styles.comparisonGrid}>
            <Card style={styles.comparisonCard}>
              <Text style={styles.comparisonTitle}>Free</Text>
              <View style={styles.featuresList}>
                {features.free.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    {feature.included ? (
                      <Check size={16} color={Colors.success} />
                    ) : (
                      <X size={16} color={Colors.textLight} />
                    )}
                    <Text
                      style={[
                        styles.featureText,
                        !feature.included && styles.featureTextDisabled,
                      ]}
                    >
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>

            <Card style={[styles.comparisonCard, styles.premiumCard]}>
              <View style={styles.premiumHeader}>
                <Crown size={20} color={Colors.warning} />
                <Text style={styles.comparisonTitle}>Premium</Text>
              </View>
              <View style={styles.featuresList}>
                {features.premium.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={16} color={Colors.success} />
                    <Text style={styles.featureText}>{feature.text}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title={`Subscribe ${selectedPlan === 'monthly' ? '$9.99/mo' : '$79.99/yr'}`}
            onPress={handleSubscribe}
            testID="subscribe-button"
          />
          <Text style={styles.disclaimer}>
            Cancel anytime. Terms and conditions apply.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 24,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    marginTop: -16,
  },
  plansContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  planCardActive: {
    borderColor: Colors.primary,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.warning,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  comparisonSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  comparisonGrid: {
    gap: 12,
  },
  comparisonCard: {
    padding: 20,
  },
  premiumCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  featureTextDisabled: {
    color: Colors.textLight,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});
