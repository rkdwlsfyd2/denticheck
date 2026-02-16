import React from "react";
import { FlatList, ListRenderItem, View, ActivityIndicator, Text } from "react-native";

export type InfiniteScrollViewProps<T> = {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** 0~1, 끝에서 이 비율만큼 남았을 때 onLoadMore 호출 (기본 0.3) */
  onEndReachedThreshold?: number;
  ListHeaderComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  contentContainerStyle?: object;
  /** 로딩 인디케이터 색 */
  loadingColor?: string;
  className?: string;
};

/**
 * 스크롤이 끝에 가까워지면 onLoadMore를 호출하는 FlatList 래퍼.
 * shared에 두어 다른 피드/목록 화면에서도 재사용 가능.
 */
export function InfiniteScrollView<T>({
  data,
  renderItem,
  keyExtractor,
  hasMore,
  loadingMore,
  onLoadMore,
  onEndReachedThreshold = 0.3,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
  loadingColor = "#0ea5e9",
  className,
}: InfiniteScrollViewProps<T>) {
  const handleEndReached = () => {
    if (hasMore && !loadingMore) onLoadMore();
  };

  const ListFooter = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={loadingColor} />
        <Text className="text-slate-400 text-xs mt-2">불러오는 중...</Text>
      </View>
    );
  };

  return (
    <FlatList<T>
      className={className}
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
}
