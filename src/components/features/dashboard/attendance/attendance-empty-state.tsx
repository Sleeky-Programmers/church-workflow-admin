"use client";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography/Text";

type AttendanceEmptyStateProps = {
  onCreateService: () => void;
};

export function AttendanceEmptyState({
  onCreateService,
}: AttendanceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="mb-8">
        <div className="relative">
          <div className="w-[400px] h-[250px] border-8 border-gray-900 rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-center h-full p-8">
              <div className="w-full max-w-xs">
                <div className="h-1 bg-primary-500 rounded-full mb-6" />

                <div className="grid grid-cols-5 gap-3">
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-primary-500 rounded-full" />
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded" />

                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-primary-400 rounded-full" />
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-900 rounded-full" />
                  <div className="h-8 bg-gray-900 rounded-full" />

                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-900 rounded-full" />
                  <div className="h-8 bg-primary-400 rounded-full" />
                  <div className="h-8 bg-gray-200 rounded" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="text-white text-2xl font-light">+</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto w-24 h-12 bg-gray-300 rounded-b-lg" />
          <div className="mx-auto w-40 h-2 bg-gray-400 rounded-full" />
        </div>
      </div>
      <Text variant="default" className=" mb-6">
        You do not have any event
      </Text>

      <Button onClick={onCreateService} size="lg">
        Create Service
      </Button>
    </div>
  );
}
