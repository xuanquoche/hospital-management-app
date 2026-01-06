import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  error,
}) => {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: Colors.neutral[700],
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1.5,
          borderColor: error ? Colors.error : Colors.border.light,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: selectedOption ? Colors.text.primary : Colors.neutral[400],
          }}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={Colors.neutral[400]}
        />
      </Pressable>
      {error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
          <Ionicons
            name="alert-circle"
            size={14}
            color={Colors.error}
            style={{ marginRight: 4 }}
          />
          <Text style={{ fontSize: 12, color: Colors.error }}>{error}</Text>
        </View>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: insets.bottom + 20,
              maxHeight: '60%',
            }}
          >
            <View
              style={{
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: Colors.border.light,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: Colors.text.primary,
                }}
              >
                {label || 'Select Option'}
              </Text>
              <Pressable onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={Colors.neutral[500]} />
              </Pressable>
            </View>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.border.light,
                    backgroundColor:
                      value === option.value
                        ? Colors.primary[50]
                        : Colors.white,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        value === option.value
                          ? Colors.primary[600]
                          : Colors.text.primary,
                      fontWeight: value === option.value ? '600' : '400',
                    }}
                  >
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={Colors.primary[500]}
                    />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

