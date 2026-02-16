import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  Package,
  Hospital as LucideHospital,
  X,
  ImagePlus,
} from "lucide-react-native";
import { useQuery } from "@apollo/client/react";
import { GET_DENTALS } from "../../graphql/queries";
import { Button } from "../../shared/components/ui/Button";

export type PostType = "all" | "product" | "hospital";

export type PostFormSubmitPayload = {
  content: string;
  postType: string | null;
  dentalIds: string[];
  images: { uri: string }[];
};

export type PostFormInitialValues = {
  content: string;
  postType: PostType | null;
  dentalIds: string[];
  tags: { type: "product" | "hospital"; name: string; id?: string }[];
  images?: { uri: string }[];
};

const MAX_IMAGES = 4;
const defaultFormState = {
  content: "",
  postType: "all" as PostType,
  tags: [] as { type: "product" | "hospital"; name: string; id?: string }[],
  images: [] as { uri: string }[],
};

export type PostFormModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: PostFormSubmitPayload) => void | Promise<void>;
  submitLoading?: boolean;
  title?: string;
  /** 수정 시 기존 값 (나중에 재사용) */
  initialValues?: PostFormInitialValues | null;
};

export function PostFormModal({
  visible,
  onClose,
  onSubmit,
  submitLoading = false,
  title = "글쓰기",
  initialValues,
}: PostFormModalProps) {
  const [formData, setFormData] = useState(defaultFormState);
  const [dentalSearch, setDentalSearch] = useState("");
  const [showDentalPicker, setShowDentalPicker] = useState(false);
  const [imagePickerOpening, setImagePickerOpening] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (initialValues) {
      setFormData({
        content: initialValues.content,
        postType: (initialValues.postType ?? "all") as PostType,
        tags: initialValues.tags ?? [],
        images: initialValues.images ?? [],
      });
      setDentalSearch("");
      setShowDentalPicker(false);
    } else {
      setFormData(defaultFormState);
      setDentalSearch("");
      setShowDentalPicker(false);
    }
  }, [visible, initialValues]);

  const {
    data: dentalsData,
    loading: dentalsLoading,
    error: dentalsError,
  } = useQuery<{
    dentals: Array<{ id: string; name: string; address?: string; phone?: string }>;
  }>(GET_DENTALS, {
    variables: { name: dentalSearch.trim() || undefined, limit: 50 },
    skip: !visible || !showDentalPicker,
    fetchPolicy: "network-only",
  });
  const dentals = dentalsData?.dentals ?? [];

  const addTag = (type: "product" | "hospital", name: string, id?: string) => {
    if (!formData.tags.find((t) => t.type === type && (id ? t.id === id : t.name === name))) {
      setFormData({
        ...formData,
        tags: [...formData.tags, { type, name, ...(id ? { id } : {}) }],
      });
    }
  };
  const hospitalTags = formData.tags.filter((t) => t.type === "hospital");
  const canAddMoreHospital = hospitalTags.length < 3;
  const addDentalTag = (dental: { id: string; name: string }) => {
    if (!canAddMoreHospital) return;
    addTag("hospital", dental.name, dental.id);
  };
  const removeTag = (index: number) => {
    setFormData({ ...formData, tags: formData.tags.filter((_, i) => i !== index) });
  };

  const pickImages = () => {
    const remaining = MAX_IMAGES - formData.images.length;
    if (remaining <= 0) return;
    setImagePickerOpening(true);
    InteractionManager.runAfterInteractions(() => {
      (async () => {
        try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("권한 필요", "사진을 선택하려면 갤러리 권한이 필요합니다.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.6,
          });
          if (result.canceled || !result.assets?.length) return;
          const newUris = result.assets.map((a) => ({ uri: a.uri })).slice(0, remaining);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newUris].slice(0, MAX_IMAGES),
          }));
        } finally {
          setImagePickerOpening(false);
        }
      })();
    });
  };
  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async () => {
    const content = formData.content.trim();
    if (!content) {
      Alert.alert("알림", "내용을 입력해 주세요.");
      return;
    }
    const dentalIds = formData.tags
      .filter((t): t is { type: "hospital"; name: string; id: string } => t.type === "hospital" && !!t.id)
      .map((t) => t.id)
      .filter((id): id is string => id != null && id !== "");
    await onSubmit({
      content,
      postType: formData.postType === "all" ? null : formData.postType,
      dentalIds,
      images: formData.images,
    });
  };

  const handleClose = () => {
    setFormData(defaultFormState);
    setShowDentalPicker(false);
    setDentalSearch("");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-gray-50 dark:bg-slate-900 rounded-t-[32px] h-[85%] p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800 dark:text-white">{title}</Text>
            <TouchableOpacity onPress={handleClose} className="w-8 h-8 items-center justify-center bg-slate-200 rounded-full">
              <X size={16} color="#475569" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            <View className="mb-4">
              <Text className="text-sm font-bold text-slate-500 mb-3 ml-1">게시글 종류</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, postType: "all" })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                    formData.postType === "all"
                      ? "bg-slate-200 dark:bg-slate-700 border-slate-400"
                      : "bg-white dark:bg-slate-800 border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.postType === "all" ? "text-slate-800 dark:text-white" : "text-slate-500"
                    }`}
                  >
                    선택 안 함(전체)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, postType: "product" })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                    formData.postType === "product"
                      ? "bg-indigo-100 border-indigo-400"
                      : "bg-white dark:bg-slate-800 border-slate-200"
                  }`}
                >
                  <Package
                    size={16}
                    color={formData.postType === "product" ? "#4338ca" : "#64748b"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      formData.postType === "product" ? "text-indigo-700" : "text-slate-500"
                    }`}
                  >
                    상품후기
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, postType: "hospital" })}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                    formData.postType === "hospital"
                      ? "bg-blue-100 border-blue-400"
                      : "bg-white dark:bg-slate-800 border-slate-200"
                  }`}
                >
                  <LucideHospital
                    size={16}
                    color={formData.postType === "hospital" ? "#1d4ed8" : "#64748b"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      formData.postType === "hospital" ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    병원후기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <TextInput
                multiline
                placeholder="어떤 이야기를 나누고 싶으신가요?"
                placeholderTextColor="#94a3b8"
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl h-48 text-base text-slate-800 dark:text-white leading-6 border border-slate-200"
                textAlignVertical="top"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-bold text-slate-500 mb-3 ml-1">사진 (최대 {MAX_IMAGES}장)</Text>
              {formData.images.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-3">
                  {formData.images.map((img, idx) => (
                    <View key={idx} className="relative">
                      <Image
                        source={{ uri: img.uri }}
                        className="w-20 h-20 rounded-xl bg-slate-200"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-800 items-center justify-center"
                      >
                        <X size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {formData.images.length < MAX_IMAGES && (
                <TouchableOpacity
                  onPress={pickImages}
                  disabled={imagePickerOpening}
                  className="flex-row items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
                >
                  {imagePickerOpening ? (
                    <>
                      <ActivityIndicator size="small" color="#64748b" />
                      <Text className="text-sm font-medium text-slate-500">갤러리 여는 중...</Text>
                    </>
                  ) : (
                    <>
                      <ImagePlus size={20} color="#64748b" />
                      <Text className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        사진 추가 ({formData.images.length}/{MAX_IMAGES})
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View>
              <Text className="text-sm font-bold text-slate-500 mb-3 ml-1">태그 추가</Text>
              <View className="flex-row gap-3 mb-2">
                <TouchableOpacity
                  disabled
                  className="flex-row items-center bg-slate-100 dark:bg-slate-700 border border-slate-200 px-3 py-2 rounded-xl opacity-60"
                >
                  <Package size={16} color="#94a3b8" style={{ marginRight: 6 }} />
                  <Text className="text-sm font-medium text-slate-400">상품 태그 (준비 중)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDentalPicker((v) => !v)}
                  className={`flex-row items-center border px-3 py-2 rounded-xl ${
                    showDentalPicker
                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400"
                      : "bg-white dark:bg-slate-800 border-slate-200"
                  }`}
                >
                  <LucideHospital
                    size={16}
                    color={showDentalPicker ? "#1d4ed8" : "#475569"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      showDentalPicker ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    치과 선택
                  </Text>
                </TouchableOpacity>
              </View>

              {showDentalPicker && (
                <View className="mb-4 mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600">
                  {hospitalTags.length > 0 && (
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      {formData.tags.map(
                        (tag, idx) =>
                          tag.type === "hospital" && (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => removeTag(idx)}
                              className="flex-row items-center pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50"
                            >
                              <Text className="text-xs font-bold mr-1 text-blue-700 dark:text-blue-300">
                                {tag.name}
                              </Text>
                              <X size={12} color="#1d4ed8" />
                            </TouchableOpacity>
                          )
                      )}
                    </View>
                  )}
                  {hospitalTags.length >= 3 && (
                    <Text className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">
                      병원은 최대 3개까지 선택할 수 있어요.
                    </Text>
                  )}
                  <Text className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    검색어 없이 보면 최대 50개 목록이 보이고, 입력하면 이름으로 필터돼요.
                  </Text>
                  <TextInput
                    placeholder="치과 이름 검색 (선택)"
                    placeholderTextColor="#94a3b8"
                    value={dentalSearch}
                    onChangeText={setDentalSearch}
                    className="bg-white dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-800 dark:text-white mb-2"
                  />
                  <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                    {dentalsLoading ? (
                      <Text className="text-slate-400 text-sm py-2">치과 목록을 불러오는 중...</Text>
                    ) : dentalsError ? (
                      <Text className="text-amber-600 dark:text-amber-400 text-sm py-2">
                        목록을 불러오지 못했어요. 네트워크를 확인해 주세요.
                      </Text>
                    ) : dentals.length === 0 ? (
                      <Text className="text-slate-400 text-sm py-2">
                        {dentalSearch.trim()
                          ? "검색 결과가 없어요."
                          : "등록된 치과가 없어요. load_dentals.py 실행 여부를 확인해 주세요."}
                      </Text>
                    ) : (
                      dentals.map((d) => (
                        <TouchableOpacity
                          key={d.id}
                          onPress={() => addDentalTag(d)}
                          disabled={!canAddMoreHospital}
                          className={`py-2.5 px-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0 ${
                            !canAddMoreHospital ? "opacity-50" : ""
                          }`}
                        >
                          <Text className="text-slate-800 dark:text-white font-medium" numberOfLines={1}>
                            {d.name}
                          </Text>
                          {d.address ? (
                            <Text className="text-xs text-slate-500 mt-0.5" numberOfLines={1}>
                              {d.address}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}

              {formData.tags.some((t) => t.type === "product") && (
                <View className="flex-row flex-wrap gap-2 mt-2">
                  {formData.tags.map(
                    (tag, idx) =>
                      tag.type === "product" && (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => removeTag(idx)}
                          className="flex-row items-center pl-3 pr-2 py-1.5 rounded-full bg-indigo-100"
                        >
                          <Text className="text-xs font-bold mr-1 text-indigo-700">{tag.name}</Text>
                          <X size={12} color="#4338ca" />
                        </TouchableOpacity>
                      )
                  )}
                </View>
              )}
            </View>
          </ScrollView>

          <Button
            onPress={handleSubmit}
            disabled={submitLoading}
            size="lg"
            className="rounded-full mt-4"
            style={{
              elevation: 10,
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          >
            <Text className="font-bold text-white text-lg">
              {submitLoading ? "등록 중..." : initialValues ? "수정하기" : "등록하기"}
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
