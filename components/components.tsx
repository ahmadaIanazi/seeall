"use client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink, User } from "lucide-react";
import { Content } from "@prisma/client";
import { Icon } from "./ui/icon";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ContentType, ThemeConfig } from "@/types";
import { getThemeClasses } from "@/lib/utils/theme.utils";
import { DEFAULT_ICONS } from "@/constants/contentTypes";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

export function ContentRenderer({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  // Render different components based on content type
  switch (content.type) {
    case ContentType.LINK:
      return <LinkComponent content={content} themeConfig={themeConfig} />;
    case ContentType.IMAGE:
      return <ImageComponent content={content} themeConfig={themeConfig} />;
    case ContentType.CATEGORY:
      return <CategoryComponent content={content} themeConfig={themeConfig} />;
    case ContentType.PRODUCT:
      return <ProductComponent content={content} themeConfig={themeConfig} />;
    case ContentType.SOCIAL:
      return <SocialComponent content={content} themeConfig={themeConfig} />;
    case ContentType.PAGE_TITLE:
      return <PageTitleComponent content={content} themeConfig={themeConfig} />;
    case ContentType.PAGE_AVATAR:
      return <ImageComponent content={content} themeConfig={themeConfig} />;
    case ContentType.PAGE_BIO:
      return <PageBioComponent content={content} themeConfig={themeConfig} />;
    case ContentType.SOCIAL_LINKS:
      return <SocialLinksComponent content={content} themeConfig={themeConfig} />;
    case ContentType.CATEGORIES_LIST:
      return <CategoriesListComponent content={content} themeConfig={themeConfig} />;
    case ContentType.BLANK:
    default:
      return <DefaultComponent content={content} themeConfig={themeConfig} />;
  }
}

// Core Image Component - Handles image rendering, carousel, and modal
export function CoreImageComponent({
  images,
  title,
  themeConfig,
  contentType,
}: {
  images: { id?: string; src: string }[];
  title?: string;
  themeConfig: ThemeConfig;
  contentType: ContentType;
}) {
  const { theme, alignment } = themeConfig;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  function openImageModal(src: string) {
    setSelectedImage(src);
  }

  function closeImageModal() {
    setSelectedImage(null);
  }

  return (
    <>
      {images.length === 1 ? (
        <div className={getThemeClasses(contentType, "imageContainer", theme, alignment)}>
          <img
            src={images[0].src}
            alt={title || "Image"}
            className={getThemeClasses(contentType, "image", theme, alignment)}
            style={{ width: "100%", height: "auto", cursor: "pointer" }}
            onClick={() => openImageModal(images[0].src)}
          />
        </div>
      ) : (
        <Carousel className='w-full'>
          <CarouselContent>
            {images.map((imgObj, index) => (
              <CarouselItem key={imgObj.id || index} className='flex justify-center'>
                <img
                  src={imgObj.src}
                  alt={`Slide ${index + 1}`}
                  className={getThemeClasses(contentType, "image", theme, alignment)}
                  style={{ width: "100%", height: "auto", cursor: "pointer" }}
                  onClick={() => openImageModal(imgObj.src)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={closeImageModal}>
          <DialogContent className='flex justify-center items-center bg-black p-2'>
            <img src={selectedImage} alt='Full-size preview' style={{ maxWidth: "100%", maxHeight: "90vh" }} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Link Component - Simple row layout with emphasis on the link
export function LinkComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  /** REQUIRED ITEMS */
  if (!content.url) return null;
  return (
    <Link href={content.url || "#"} className={getThemeClasses(ContentType.LINK, "container", theme, alignment)}>
      <Card className={getThemeClasses(ContentType.LINK, "card", theme, alignment)}>
        <CardContent className={getThemeClasses(ContentType.LINK, "cardContent", theme, alignment)}>
          <div className={getThemeClasses(ContentType.LINK, "titleWrapper", theme, alignment)}>
            <div className={getThemeClasses(ContentType.LINK, "titleWrapper", theme, alignment)}></div>
            <div className={getThemeClasses(ContentType.LINK, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.LINK, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.LINK]}
            </div>
            <div>
              {content.title && <h3 className={getThemeClasses(ContentType.LINK, "title", theme, alignment)}>{content.title}</h3>}
              {content.description && <p className={getThemeClasses(ContentType.LINK, "description", theme, alignment)}>{content.description}</p>}
            </div>
          </div>
          <ExternalLink className='h-4 w-4 text-muted-foreground' />
        </CardContent>
      </Card>
    </Link>
  );
}

// Image Component - Emphasizes the image with other content below
export function ImageComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  if (!content.image || !Array.isArray(content.image) || content.image.length === 0) return null;

  // Check if image has no additional content
  const hasNoAdditionalContent = !content.title && !content.description && !content.url && !content.icon;

  // If there's no additional content, render only the image(s) without card wrapper
  if (hasNoAdditionalContent) {
    return <CoreImageComponent images={content.image} themeConfig={themeConfig} contentType={ContentType.IMAGE} />;
  }

  // If there is additional content, use the original card layout
  return (
    <Card className={getThemeClasses(ContentType.IMAGE, "card", theme, alignment)}>
      <CoreImageComponent images={content.image} title={content.title} themeConfig={themeConfig} contentType={ContentType.IMAGE} />

      <CardContent className={getThemeClasses(ContentType.IMAGE, "cardContent", theme, alignment)}>
        {content.title && (
          <div className={getThemeClasses(ContentType.IMAGE, "titleWrapper", theme, alignment)}>
            <div className={getThemeClasses(ContentType.IMAGE, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.IMAGE, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.IMAGE]}
            </div>
            <h3 className={getThemeClasses(ContentType.IMAGE, "title", theme, alignment)}>{content.title}</h3>
          </div>
        )}
        {content.description && <p className={getThemeClasses(ContentType.IMAGE, "description", theme, alignment)}>{content.description}</p>}
        {content.url && (
          <div className='mt-3'>
            <Link href={content.url} className={getThemeClasses(ContentType.IMAGE, "link", theme, alignment)}>
              View More
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Image Component - Emphasizes the image with other content below
export function ImageComponentX({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!content.image || !Array.isArray(content.image) || content.image.length === 0) return null;

  function isBase64Image(src: string) {
    return typeof src === "string" && src.startsWith("data:image");
  }

  function openImageModal(src: string) {
    setSelectedImage(src);
  }

  function closeImageModal() {
    setSelectedImage(null);
  }

  // Check if image has no additional content
  const hasNoAdditionalContent = !content.title && !content.description && !content.url && !content.icon;

  // If there's no additional content, render only the image(s) without card wrapper
  if (hasNoAdditionalContent) {
    return (
      <>
        {content.image.length === 1 ? (
          <div className={getThemeClasses(ContentType.IMAGE, "imageContainer", theme, alignment)}>
            {isBase64Image(content.image[0].src) ? (
              <img
                src={content.image[0].src}
                alt='Image'
                className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                style={{ width: "auto", height: "auto", cursor: "pointer" }}
                onClick={() => openImageModal(content.image[0].src)}
              />
            ) : (
              <Image
                src={content.image[0].src}
                alt='Image'
                className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                width={800}
                height={600}
                objectFit='contain'
                onClick={() => openImageModal(content.image[0].src)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        ) : (
          <Carousel className='w-full'>
            <CarouselContent>
              {content.image.map((imgObj, index) => (
                <CarouselItem key={imgObj.id || index} className='flex justify-center'>
                  {isBase64Image(imgObj.src) ? (
                    <img
                      src={imgObj.src}
                      alt={`Slide ${index + 1}`}
                      className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                      style={{ width: "100%", height: "auto", cursor: "pointer" }}
                      onClick={() => openImageModal(imgObj.src)}
                    />
                  ) : (
                    <Image
                      src={imgObj.src}
                      alt={`Slide ${index + 1}`}
                      className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                      width={800}
                      height={600}
                      objectFit='contain'
                      onClick={() => openImageModal(imgObj.src)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        {/* Fullscreen Image Modal */}
        {selectedImage && (
          <Dialog open={true} onOpenChange={closeImageModal}>
            <DialogContent className='flex justify-center items-center bg-black p-2'>
              <img src={selectedImage} alt='Full-size preview' style={{ maxWidth: "100%", maxHeight: "90vh" }} />
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }

  // If there is additional content, use the original card layout
  return (
    <Card className={getThemeClasses(ContentType.IMAGE, "card", theme, alignment)}>
      {content.image.length === 1 ? (
        <div className={getThemeClasses(ContentType.IMAGE, "imageContainer", theme, alignment)}>
          {isBase64Image(content.image[0].src) ? (
            <img
              src={content.image[0].src}
              alt={content.title || "Featured image"}
              className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
              style={{ width: "100%", height: "auto", cursor: "pointer" }}
              onClick={() => openImageModal(content.image[0].src)}
            />
          ) : (
            <Image
              src={content.image[0].src}
              alt={content.title || "Featured image"}
              className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
              width={800}
              height={600}
              objectFit='contain'
              onClick={() => openImageModal(content.image[0].src)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      ) : (
        <Carousel className='w-full'>
          <CarouselContent>
            {content.image.map((imgObj, index) => (
              <CarouselItem key={imgObj.id || index} className='flex justify-center'>
                {isBase64Image(imgObj.src) ? (
                  <img
                    src={imgObj.src}
                    alt={`Slide ${index + 1}`}
                    className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                    style={{ width: "100%", height: "auto", cursor: "pointer" }}
                    onClick={() => openImageModal(imgObj.src)}
                  />
                ) : (
                  <Image
                    src={imgObj.src}
                    alt={`Slide ${index + 1}`}
                    className={getThemeClasses(ContentType.IMAGE, "image", theme, alignment)}
                    width={800}
                    height={600}
                    objectFit='contain'
                    onClick={() => openImageModal(imgObj.src)}
                    style={{ cursor: "pointer" }}
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

      <CardContent className={getThemeClasses(ContentType.IMAGE, "cardContent", theme, alignment)}>
        {content.title && (
          <div className={getThemeClasses(ContentType.IMAGE, "titleWrapper", theme, alignment)}>
            <div className={getThemeClasses(ContentType.IMAGE, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.IMAGE, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.IMAGE]}
            </div>
            <h3 className={getThemeClasses(ContentType.IMAGE, "title", theme, alignment)}>{content.title}</h3>
          </div>
        )}
        {content.description && <p className={getThemeClasses(ContentType.IMAGE, "description", theme, alignment)}>{content.description}</p>}
        {content.url && (
          <div className='mt-3'>
            <Link href={content.url} className={getThemeClasses(ContentType.IMAGE, "link", theme, alignment)}>
              View More
            </Link>
          </div>
        )}
      </CardContent>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={closeImageModal}>
          <DialogContent className='flex justify-center items-center bg-black p-2'>
            <img src={selectedImage} alt='Full-size preview' style={{ maxWidth: "100%", maxHeight: "90vh" }} />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

// Category Component - Emphasizes the title as a section header
export function CategoryComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <Card className={getThemeClasses(ContentType.CATEGORY, "card", theme, alignment)}>
      <CardHeader className={getThemeClasses(ContentType.CATEGORY, "cardHeader", theme, alignment)}>
        {content.title && (
          <div className={getThemeClasses(ContentType.CATEGORY, "titleWrapper", theme, alignment)}>
            <div className={getThemeClasses(ContentType.CATEGORY, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.CATEGORY, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.CATEGORY]}
            </div>
            <CardTitle className={getThemeClasses(ContentType.CATEGORY, "title", theme, alignment)}>{content.title}</CardTitle>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {content.image && Array.isArray(content.image) && content.image.length > 0 && (
          <CoreImageComponent images={content.image} title={content.title} themeConfig={themeConfig} contentType={ContentType.CATEGORY} />
        )}
        {content.description && <CardDescription className={getThemeClasses(ContentType.CATEGORY, "description", theme, alignment)}>{content.description}</CardDescription>}
        {content.url && (
          <div className='mt-3'>
            <Link href={content.url} className={getThemeClasses(ContentType.CATEGORY, "link", theme, alignment)}>
              {content.url}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Category Component - Emphasizes the title as a section header
export function CategoryComponentX({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <Card className={getThemeClasses(ContentType.CATEGORY, "card", theme, alignment)}>
      <CardHeader className={getThemeClasses(ContentType.CATEGORY, "cardHeader", theme, alignment)}>
        {content.title && (
          <div className={getThemeClasses(ContentType.CATEGORY, "titleWrapper", theme, alignment)}>
            <div className={getThemeClasses(ContentType.CATEGORY, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.CATEGORY, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.CATEGORY]}
            </div>
            <CardTitle className={getThemeClasses(ContentType.CATEGORY, "title", theme, alignment)}>{content.title}</CardTitle>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {content.image && (
          <div className='mb-3 overflow-hidden rounded-md'>
            <img src={content.image || "/placeholder.svg"} alt='' className='w-full' />
          </div>
        )}
        {content.description && <CardDescription className={getThemeClasses(ContentType.CATEGORY, "description", theme, alignment)}>{content.description}</CardDescription>}
        {content.url && (
          <div className='mt-3'>
            <Link href={content.url} className={getThemeClasses(ContentType.CATEGORY, "link", theme, alignment)}>
              {content.url}
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Product Component - Structured like an e-commerce product card
export function ProductComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <Card className={getThemeClasses(ContentType.PRODUCT, "card", theme, alignment)}>
      {content.image && Array.isArray(content.image) && content.image.length > 0 && (
        <div className='relative'>
          <CoreImageComponent images={content.image} title={content.title} themeConfig={themeConfig} contentType={ContentType.PRODUCT} />
          {content.price && content.currency && (
            <Badge
              className={
                getThemeClasses(ContentType.PRODUCT, "badge", theme, alignment) + " " + getThemeClasses(ContentType.PRODUCT, "badge", theme, alignment) + " absolute right-2 top-2"
              }
            >
              {content.price} {content.currency}
            </Badge>
          )}
        </div>
      )}
      <CardHeader className={getThemeClasses(ContentType.PRODUCT, "cardHeader", theme, alignment)}>
        {content.title && (
          <div className={getThemeClasses(ContentType.PRODUCT, "titleWrapper", theme, alignment)}>
            <div className='flex items-center gap-2'>
              <div className={getThemeClasses(ContentType.PRODUCT, "iconContainer", theme, alignment)}>
                {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.PRODUCT, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.PRODUCT]}
              </div>
              <CardTitle className={getThemeClasses(ContentType.PRODUCT, "title", theme, alignment)}>{content.title}</CardTitle>
            </div>
            {(!content.image || !Array.isArray(content.image) || content.image.length === 0) && content.price && content.currency && (
              <Badge className={getThemeClasses(ContentType.PRODUCT, "badge", theme, alignment) + " " + getThemeClasses(ContentType.PRODUCT, "badge", theme, alignment)}>
                {content.price} {content.currency}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className={getThemeClasses(ContentType.PRODUCT, "cardContent", theme, alignment)}>
        {content.description && <p className={getThemeClasses(ContentType.PRODUCT, "description", theme, alignment)}>{content.description}</p>}
      </CardContent>
      {content.url && (
        <CardFooter className='pt-0'>
          <Button asChild variant='outline' size='sm' className={getThemeClasses(ContentType.PRODUCT, "button", theme, alignment) + " w-full"}>
            <Link href={content.url}>View Product</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

// Social Component - Optimized for social media profiles
export function SocialComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <Card className={getThemeClasses(ContentType.SOCIAL, "card", theme, alignment)}>
      <CardContent className={getThemeClasses(ContentType.SOCIAL, "cardContent", theme, alignment)}>
        <div className={getThemeClasses(ContentType.SOCIAL, "titleWrapper", theme, alignment)}>
          {content.image ? (
            <div className={getThemeClasses(ContentType.SOCIAL, "imageContainer", theme, alignment)}>
              <img src={content.image || "/placeholder.svg"} alt={content.title || "Profile"} className={getThemeClasses(ContentType.SOCIAL, "image", theme, alignment)} />
            </div>
          ) : (
            <div className={getThemeClasses(ContentType.SOCIAL, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.SOCIAL, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.SOCIAL]}
            </div>
          )}
          <div>
            {content.title && <h3 className={getThemeClasses(ContentType.SOCIAL, "title", theme, alignment)}>{content.title}</h3>}
            {content.description && <p className={getThemeClasses(ContentType.SOCIAL, "description", theme, alignment)}>{content.description}</p>}
          </div>
        </div>
        {content.url && (
          <div className='mt-3'>
            <Button asChild variant='secondary' size='sm' className={getThemeClasses(ContentType.SOCIAL, "button", theme, alignment) + " w-full"}>
              <Link href={content.url}>
                <User className='mr-2 h-4 w-4' />
                Follow
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Default/Blank Component - Generic card layout
export function DefaultComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <Card className={getThemeClasses(ContentType.BLANK, "card", theme, alignment)}>
      <CardContent className={getThemeClasses(ContentType.BLANK, "cardContent", theme, alignment)}>
        {content.title && (
          <div className='mb-2 flex items-center gap-2'>
            <div className={getThemeClasses(ContentType.BLANK, "iconContainer", theme, alignment)}>
              {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.BLANK, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.BLANK]}
            </div>
            <h3 className={getThemeClasses(ContentType.BLANK, "title", theme, alignment)}>{content.title}</h3>
          </div>
        )}
        {content.image && (
          <div className='mb-3 overflow-hidden rounded-md'>
            <img src={content.image || "/placeholder.svg"} alt='' className='w-full' />
          </div>
        )}
        {content.description && <p className={getThemeClasses(ContentType.BLANK, "description", theme, alignment)}>{content.description}</p>}
        {content.url && (
          <div className='mt-3'>
            <Link href={content.url} className={getThemeClasses(ContentType.BLANK, "link", theme, alignment)}>
              {content.url}
            </Link>
          </div>
        )}
        {content.price && content.currency && (
          <div className='mt-2'>
            <Badge variant='outline' className={getThemeClasses(ContentType.BLANK, "badge", theme, alignment)}>
              {content.price} {content.currency}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Page Title Component - Large, prominent title for the portfolio
export function PageTitleComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  return (
    <div className={getThemeClasses(ContentType.PAGE_TITLE, "container", theme, alignment)}>
      {content.title && <h1 className={getThemeClasses(ContentType.PAGE_TITLE, "title", theme, alignment)}>{content.title}</h1>}
    </div>
  );
}

// Page Avatar Component - Profile image with optional border
export function PageAvatarComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  if (!content.title) return null;

  return (
    <div className={getThemeClasses(ContentType.PAGE_AVATAR, "container", theme, alignment)}>
      {content.image ? (
        <div className={getThemeClasses(ContentType.PAGE_AVATAR, "imageContainer", theme, alignment)}>
          <img src={content.image || "/placeholder.svg"} alt={content.title || "Profile"} className={getThemeClasses(ContentType.PAGE_AVATAR, "image", theme, alignment)} />
        </div>
      ) : (
        <div className={getThemeClasses(ContentType.PAGE_AVATAR, "iconContainer", theme, alignment)}>
          {content.icon ? <Icon name={content.icon} className={getThemeClasses(ContentType.PAGE_AVATAR, "icon", theme, alignment)} /> : DEFAULT_ICONS[ContentType.PAGE_AVATAR]}
        </div>
      )}
    </div>
  );
}

// Page Bio Component - Detailed biography section
export function PageBioComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  if (!content.description) return null;
  return <CardContent>{content.description && <p className={getThemeClasses(ContentType.PAGE_BIO, "description", theme, alignment)}>{content.description}</p>}</CardContent>;
}

// Social Links Component - Row of social media icons/links
export function SocialLinksComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;

  if (!content.socialLinks || content.socialLinks.length === 0) {
    return null;
  }

  return (
    <Card className={getThemeClasses(ContentType.SOCIAL_LINKS, "card", theme, alignment)}>
      {content.title && (
        <CardHeader className={getThemeClasses(ContentType.SOCIAL_LINKS, "cardHeader", theme, alignment)}>
          <CardTitle className={getThemeClasses(ContentType.SOCIAL_LINKS, "title", theme, alignment)}>{content.title}</CardTitle>
          {content.description && <CardDescription className={getThemeClasses(ContentType.SOCIAL_LINKS, "description", theme, alignment)}>{content.description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div className={getThemeClasses(ContentType.SOCIAL_LINKS, "socialLinksList", theme, alignment)}>
          {content.socialLinks.map((link, index) => (
            <Link key={index} href={link.url} className={getThemeClasses(ContentType.SOCIAL_LINKS, "socialItem", theme, alignment)}>
              {link.icon ? (
                <Icon name={link.icon} className={getThemeClasses(ContentType.SOCIAL_LINKS, "icon", theme, alignment)} />
              ) : (
                <span className='text-sm font-medium'>{link.platform.substring(0, 2)}</span>
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Categories List Component - Horizontal scrollable list of categories

export function CategoriesListComponent({ content, themeConfig }: { content: Content | Partial<Content>; themeConfig: ThemeConfig }) {
  const { theme, alignment } = themeConfig;
  if (!content.categories || content.categories.length === 0) {
    return null;
  }

  return (
    <div className={getThemeClasses(ContentType.CATEGORIES_LIST, "container", theme, alignment)}>
      {content.title && <h3 className={getThemeClasses(ContentType.CATEGORIES_LIST, "title", theme, alignment) + " mb-3"}>{content.title}</h3>}
      <div className={getThemeClasses(ContentType.CATEGORIES_LIST, "categoriesList", theme, alignment)}>
        {content.categories.map((category, index) => (
          <Link key={index} href={category.url || "#"} className={getThemeClasses(ContentType.CATEGORIES_LIST, "categoryItem", theme, alignment)}>
            {category.icon && (
              <div className='flex h-5 w-5 items-center justify-center text-primary'>
                <Icon name={category.icon} className='h-4 w-4' />
              </div>
            )}
            {content.image && Array.isArray(category.image) && category.image.length > 0 && (
              <CoreImageComponent images={category.image} title={category.title} themeConfig={themeConfig} contentType={ContentType.CATEGORY} />
            )}
            <span>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
