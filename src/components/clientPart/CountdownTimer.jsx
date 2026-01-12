import { useState, useEffect } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target to 3 days from now
    const target = new Date();
    target.setDate(target.getDate() + 3);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <section className="py-12 px-4 bg-card/30">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-serif text-gradient-gold mb-8">
          দ্রুত করুন !! অফার শুধুমাত্র এর জন্য উপলব্ধ
        </h2>

        <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
          {timeBlocks.map((block) => (
            <div
              key={block.label}
              className="bg-card border border-border rounded-xl p-4 md:p-6 min-w-[70px] md:min-w-[100px] shadow-lg"
            >
              <div className="text-2xl md:text-4xl font-bold text-gold">
                {String(block.value).padStart(2, "0")}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                {block.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;