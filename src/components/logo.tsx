
import { TrendingUp } from 'lucide-react'; // Or any other suitable icon

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
      <h1 className="text-xl sm:text-2xl font-bold text-primary font-headline">
        Finance Flow
      </h1>
    </div>
  );
}

