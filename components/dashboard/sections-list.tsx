"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStore } from "@/lib/store/dashboard";
import { useStyles } from "@/lib/store/styles";
import { Icon } from "../ui/icon";

export default function SectionsList() {
  const { edit, contents, updateContent } = useDashboardStore();
  const { styles } = useStyles();

  const categories = contents?.filter((item) => item.anchor === true);

  function handleToggleCategoryVisibile(content) {
    const updatedContent = { ...content, anchor: !content.anchor };
    updateContent(updatedContent);
  }

  return (
    <div className='relative'>
      <ScrollArea className='w-full'>
        <div className='flex space-x-4 w-max px-4 py-2'>
          {categories?.map((cat) => {
            const fallback = cat?.title?.[0]?.toUpperCase() || "";
            const visible = cat?.anchor || true;

            let content;
            if (cat.image) {
              content = <AvatarImage src={cat.image} alt={cat.title} />;
            } else if (cat.icon) {
              content = <Icon name={cat.icon} />;
            } else {
              content = <AvatarFallback>{fallback}</AvatarFallback>;
            }

            return (
              <div key={cat.id} className={`relative flex flex-col items-center shrink-0 ${styles.contentItem}`}>
                <div className='group relative'>
                  <Avatar className={`w-16 h-16 flex items-center justify-center text-xl ${styles.image}`}>{content}</Avatar>
                  {edit && (
                    <button onClick={() => handleToggleCategoryVisibile(cat)} className='absolute top-0 right-0 m-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Icon name='Eye' />
                    </button>
                  )}
                </div>
                <span className='text-sm mt-2 text-center w-16 line-clamp-1'>{cat.title}</span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className='pointer-events-none absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white dark:from-black to-transparent' />
      <div className='pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white dark:from-black to-transparent' />
    </div>
  );
}
