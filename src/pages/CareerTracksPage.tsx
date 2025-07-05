import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  TrendingUp, 
  DollarSign,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Award
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import apiService from '../services/api';

const CareerTracksPage: React.FC = () => {
  const [careerTracks, setCareerTracks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    const fetchCareerTracks = async () => {
      try {
        const tracks = await apiService.getCareerTracks();
        setCareerTracks(tracks);
      } catch (error) {
        console.error('Failed to fetch career tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerTracks();
  }, []);

  const filteredTracks = careerTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         track.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || track.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || track.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'data-science', label: 'Data Science' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Beginner' },
    { value: 'medium', label: 'Intermediate' },
    { value: 'hard', label: 'Advanced' },
    { value: 'expert', label: 'Expert' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'very-high': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" text="Loading career tracks..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Target className="w-8 h-8" />
            AI-Powered Career Tracks
          </h1>
          <p className="text-lg text-primary-100 mb-6">
            Discover your ideal career path with our intelligent recommendations. 
            Each track is designed to take you from beginner to job-ready professional.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>Industry Validated</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span>Real-World Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search career tracks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="input"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>

          <button className="btn btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="text-2xl font-bold text-primary-600">{careerTracks.length}</div>
          <div className="text-sm text-gray-600">Career Tracks</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="text-2xl font-bold text-green-600">95%</div>
          <div className="text-sm text-gray-600">Job Success Rate</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">6-18</div>
          <div className="text-sm text-gray-600">Months to Complete</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">$85K</div>
          <div className="text-sm text-gray-600">Average Starting Salary</div>
        </div>
      </div>

      {/* Career Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track) => (
          <div key={track.id} className="career-card group">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: track.color + '20' }}
                  >
                    {track.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                      {track.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`skill-badge ${getDemandColor(track.demandLevel)}`}>
                        {track.demandLevel.replace('-', ' ')} demand
                      </span>
                    </div>
                  </div>
                </div>
                <Star className="w-5 h-5 text-gray-300 hover:text-yellow-500 cursor-pointer transition-colors" />
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {track.description}
              </p>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Skills:</h4>
                <div className="flex flex-wrap gap-1">
                  {track.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                  {track.requiredSkills.length > 3 && (
                    <span className="skill-badge bg-gray-100 text-gray-600">
                      +{track.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Salary Range</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${track.avgSalary.min.toLocaleString()} - ${track.avgSalary.max.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {track.estimatedTime}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Difficulty</span>
                  </div>
                  <span className={`skill-badge ${getDifficultyColor(track.difficulty)}`}>
                    {track.difficulty}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/career-tracks/${track.id}`}
                  className="btn btn-primary flex-1 text-center group-hover:scale-105 transition-transform"
                >
                  Explore Track
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <button 
                  className="btn btn-outline px-3"
                  title="Get personalized recommendation"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress indicator for enrolled tracks */}
            <div className="h-1 bg-gray-100">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                style={{ width: '0%' }} // This would be dynamic based on user progress
              />
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No career tracks found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters
          </p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Not sure which track is right for you?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Take our AI-powered assessment to get personalized career recommendations 
          based on your skills, interests, and goals.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/assessment" className="btn btn-primary">
            Take Assessment
          </Link>
          <Link to="/quiz" className="btn btn-outline">
            Career Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CareerTracksPage; 