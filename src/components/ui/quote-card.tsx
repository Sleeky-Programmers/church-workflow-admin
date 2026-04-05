import { Text, Span } from "@/components/ui/typography/Text";

type QuoteCardProps = {
  verse: string;
  reference: string;
};

export function QuoteCard({ verse, reference }: QuoteCardProps) {
  return (
    <div className="bg-transparent p-8 rounded-lg border backdrop-blur-md border-gray-700">
      <Text variant="quote" className="mb-6">
        &quot;{verse}&quot;
      </Text>
      <Span variant="default" className="block text-gray-100">
        {reference}
      </Span>
    </div>
  );
}
