import { useQuery } from "@tanstack/react-query";
import { News } from "@shared/schema";
import { useState, useEffect, useRef } from "react";

export default function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: newsItems, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news/category/alerts"],
  });

  // Auto-scroll breaking news
  useEffect(() => {
    if (!newsItems || newsItems.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [newsItems]);

  // Create smooth marquee effect
  useEffect(() => {
    if (!containerRef.current || !newsItems || newsItems.length === 0) return;
    
    const marqueeText = containerRef.current;
    const animateMarquee = () => {
      if (!marqueeText) return;
      
      const computedStyle = window.getComputedStyle(marqueeText);
      const width = parseFloat(computedStyle.width);
      let position = 0;
      
      const step = () => {
        position -= 1;
        if (position <= -width) {
          position = 0;
        }
        if (marqueeText) {
          marqueeText.style.transform = `translateX(${position}px)`;
        }
        requestAnimationFrame(step);
      };
      
      requestAnimationFrame(step);
    };
    
    animateMarquee();
  }, [newsItems]);

  if (isLoading) {
    return (
      <div className="bg-secondary text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="font-bold mr-2">BREAKING:</span>
          <div className="overflow-hidden">
            <div className="whitespace-nowrap">Loading breaking news...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  const breakingNewsText = newsItems
    .map(news => news.title)
    .join(" • ");

  return (
    <div className="bg-secondary text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center">
        <span className="font-bold mr-2 whitespace-nowrap">BREAKING:</span>
        <div className="overflow-hidden">
          <div 
            ref={containerRef}
            className="whitespace-nowrap"
          >
            {breakingNewsText}
          </div>
        </div>
      </div>
    </div>
  );
}
