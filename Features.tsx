import MagicBento from './MagicBento';

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background/80 backdrop-blur-sm scroll-mt-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Powered by <span className="text-transparent bg-gradient-neural bg-clip-text">Advanced AI</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            JobSnap combines cutting-edge machine learning with intelligent automation to revolutionize how you discover and apply for jobs.
          </p>
        </div>
        <MagicBento enableTilt={true} />
      </div>
    </section>
  );
};

export default Features;